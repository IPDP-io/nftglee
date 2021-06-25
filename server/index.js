const path = require('path');
const jwt = require('jsonwebtoken');
const zmq = require('zeromq');
const WebSocket = require('ws');
const wretch = require('wretch');
const electrs = wretch().url('http://localhost:3012');
const { address: Address, networks, Transaction } = require('litecoinjs-lib');
const { createIssuance, pay } = require('./wallet');
const { Transform } = require('stream');
const fs = require('fs');

const network = networks.litereg;
const { HASURA_JWT } = process.env;

auth = {
	preValidation(req, res, done) {
		let fail = () => res.code(401).send('Unauthorized');
		if (!req.headers.authorization) fail();
		let token = req.headers.authorization.split(' ')[1];
		if (!token) fail();
		let { key } = JSON.parse(HASURA_JWT);
		try {
			req.token = jwt.verify(token, key);
			done();
		} catch (e) {
			console.log(e.message);
			fail();
		}
	}
};

app = require('fastify')({
	logger: true
});

let paused = false;
app.get('/file/:name', function (request, reply) {
	const { name } = request.params;
	const stream = fs.createReadStream(`file/${name}`);

	let type;
	if (name.includes('m3u8')) type = 'application/vnd.apple.mpegurl';
	if (name.includes('ts')) type = 'video/MP2T';

	reply.header('Content-Type', type).send(stream);
});

app.listen(8091, '0.0.0.0', function (err, address) {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
	app.log.info(`server listening on ${address}`);
});

let subscribers = {};
let asset;
async function run() {
	wss = new WebSocket.Server({ port: 9090 });

	wss.on('connection', function connection(ws) {
		ws.on('message', async function incoming(message) {
			try {
				let { type, value } = JSON.parse(message);

				if (type === 'subscribe') {
					subscribers[value] = ws;
				}

				if (type === 'send') {
					let txid = await pay(value, asset);
					ws.send(JSON.stringify({ type: 'txid', value: txid }));
				}

				if (type === 'mint') {
					asset = await createIssuance({
						domain: 'litecoin.com',
						name: 'chikkun',
						ticker: 'CHIK'
					});

					ws.send(JSON.stringify({ type: 'asset', value: asset }));
				}
			} catch (e) {
				console.log(e);
			}
		});
	});

	const sock = new zmq.Subscriber();

	sock.connect('tcp://127.0.0.1:18703');
	sock.subscribe('rawtx');

	for await (const [topic, msg] of sock) {
		console.log(topic, msg);
		try {
			let hex = msg.toString('hex');

			let tx = Transaction.fromHex(hex);
			for (let i = 0; i < tx.outs.length; i++) {
				let { script, value } = tx.outs[i];
				if (!script) continue;
				let address = Address.fromOutputScript(script, network);
				console.log(subscribers, address);

				if (subscribers[address]) {
					subscribers[address].send(JSON.stringify({ type: 'payment', value }));
				}
			}
		} catch (e) {
			// console.log(e);
		}
	}
}

run();

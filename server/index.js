const path = require('path');
const jwt = require('jsonwebtoken');
const zmq = require('zeromq');
const WebSocket = require('ws');

const { address: Address, networks, Transaction } = require('litecoinjs-lib');
const { createIssuance, pay } = require('./wallet');
const { Transform } = require('stream');
const fs = require('fs');

const { binance } = require('./api');

const network = networks.litereg;

invoices = {};
subscribers = {};

let asset;
app = require('fastify')({
	logger: true
});

require("./auth");
require("./coinos");

app.get('/rates', async function (request, reply) {
	let { price: btc } = await binance.query({ symbol: 'BTCUSDT' }).get().json().catch(console.log);
	let { price: ltc } = await binance.query({ symbol: 'LTCUSDT' }).get().json().catch(console.log);

	reply.send({ btc, ltc });
});

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

async function run() {
	wss = new WebSocket.Server({ port: 9090 });

	wss.on('connection', function connection(ws) {
		ws.on('message', async function incoming(message) {
			try {
				let { type, value } = JSON.parse(message);

				if (type === 'subscribe') {
          console.log("subscribing", value);
					subscribers[value] = ws;
				}

				if (type === 'send') {
					let txid = await pay(value, asset);
					ws.send(JSON.stringify({ type: 'txid', value: txid }));
				}

				if (type === 'mint') {
					asset = await createIssuance({
						domain: 'silhouettesthemovie.com',
						name: 'SIL',
						ticker: 'TIER1'
					});

					ws.send(JSON.stringify({ type: 'asset', value: asset }));
				}
			} catch (e) {
				console.log(e.message);
			}
		});
	});

	const sock = new zmq.Subscriber();

	sock.connect('tcp://127.0.0.1:18703');
	sock.subscribe('rawtx');

	for await (const [topic, msg] of sock) {
		try {
			let hex = msg.toString('hex');

			let tx = Transaction.fromHex(hex);
			for (let i = 0; i < tx.outs.length; i++) {
				let { script, value } = tx.outs[i];
				if (!script) continue;
				let address = Address.fromOutputScript(script, network);

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

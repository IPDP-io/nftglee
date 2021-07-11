const path = require('path');
const jwt = require('jsonwebtoken');
const zmq = require('zeromq');
const WebSocket = require('ws');
const wretch = require('wretch');

const logMiddleware = () => (next) => (url, opts) => {
	return next(url, opts);
};

const { address: Address, networks, Transaction } = require('litecoinjs-lib');
const { createIssuance, pay } = require('./wallet');
const { Transform } = require('stream');
const fs = require('fs');

const { COINOS_URL, COINOS_TOKEN, HASURA_JWT, HASURA_SECRET } = process.env;

const coinos = wretch()
	.middlewares([logMiddleware()])
	.url(COINOS_URL)
	.auth(`Bearer ${COINOS_TOKEN}`);

const electrs = wretch().url('http://localhost:3012');
const hbp = wretch().url('http://localhost:3400');

const hasura = wretch()
	.url('http://localhost:8080/v1/graphql')
	.headers({ 'x-hasura-admin-secret': HASURA_SECRET });

const network = networks.litereg;

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

app.post('/register', async (req, res) => {
	let { address, mnemonic, email, password, username } = req.body;

	try {
		let response = await hbp.url('/auth/register').post({ email, password }).res();

		let query = `mutation ($user: users_set_input!, $email: String!) {
      update_users(where: {display_name: {_eq: $email}}, _set: $user) {
        affected_rows 
      }
    }`;

		response = await hasura
			.post({
				query,
				variables: {
					email,
					user: {
						username,
						address,
						mnemonic
					}
				}
			})
			.json();

		if (response.errors) {
			let deleteQuery = `mutation { 
        delete_users(where: { account: { email: { _eq: "${email}" } } }) 
        { 
          affected_rows 
        } 
      }`;

			await hasura.post({ query: deleteQuery }).json();
			if (response.errors.find((e) => e.message.includes('Unique')))
				throw new Error('Username taken');
			throw new Error('There was an error during registration');
		}

		res.send({ success: true });
	} catch (e) {
		console.log(e);
		res.code(500).send(e.message);
	}
});

app.post('/boom', async (req, res) => {
	console.log(req.body);

	subscribers[req.body.address].send(JSON.stringify({ type: 'payment', value: req.body }));
	res.send(req.body);
});

app.post('/BTC', async (req, res) => {
	let network = 'bitcoin';
	let { amount } = req.body;

	let { address } = await coinos.url('/address').query({ network, type: 'bech32' }).get().json();

	await coinos
		.url('/invoice')
		.post({
			invoice: {
				address,
				network,
				text: address,
				amount,
				webhook: 'http://172.17.0.1:8091/boom'
			}
		})
		.json();

	return { address };
});

app.get('/rates', async function (request, reply) {
	let { price: btc } = await wretch()
		.url('https://api.binance.com/api/v3/ticker/price')
		.query({ symbol: 'BTCUSDT' })
		.get()
		.json()
		.catch(console.log);

	let { price: ltc } = await wretch()
		.url('https://api.binance.com/api/v3/ticker/price')
		.query({ symbol: 'LTCUSDT' })
		.get()
		.json()
		.catch(console.log);

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

const { electrs, userApi, hasura } = require('./api');
const path = require('path');
const WebSocket = require('ws');

const { createIssuance, pay } = require('./wallet');
const { Transform } = require('stream');
const fs = require('fs');
const persist = require('./persist');

invoices = persist('invoices.json');
subscribers = {};

let asset;
app = require('fastify')({
	logger: true
});

require('./auth');
require('./mail');
require('./payments');
require('./litecoin');

nfts = [];
last = undefined;

getNfts = async () => {
	if (!last || new Date() - last > 30000) {
		let query = `query {
      nfts {
        asset,
        ticket,
        type
      }
    }`;

		let result = await hasura.post({ query }).json();
		({ nfts } = result.data);

		last = new Date();
	}
};

app.get('/goodies', auth(), async (req, res) => {
	let utxos = await electrs.url(`/address/${req.user.address}/utxo`).get().json();
	await getNfts();

	let arr = [];
	utxos.map((tx) => {
		let nft = nfts.find((t) => t.asset === tx.asset);
		if (nft) {
			nft.confirmed = tx.status.confirmed;
			nft.txid = tx.txid;
			nft.vout = tx.vout;
			arr.push(nft);
		}
	});
	return arr;
});

app.get('/user', auth(), async (req, res) => {
	return req.user;
});

app.get('/file/:name', auth([loggedIn, checkTicket]), (req, res) => {
	const { name } = req.params;
	const stream = fs.createReadStream(`file/${name}`);

	let type;
	if (name.includes('m3u8')) type = 'application/vnd.apple.mpegurl';
	if (name.includes('ts')) type = 'video/MP2T';

	res.header('Content-Type', type).send(stream);
});

app.listen(8091, '0.0.0.0', (err, address) => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
	app.log.info(`server listening on ${address}`);
});

let run = async () => {
	wss = new WebSocket.Server({ port: 9090 });

	wss.on('connection', function connection(ws) {
		ws.on('message', async function incoming(message) {
			try {
				let { type, value } = JSON.parse(message);

				if (type === 'subscribe') {
					console.log('subscribing', value);
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
};

run();

const { binance, coinos, electrs, hasura } = require('./api');
const { mint } = require('./wallet');

const ticketPrice = 20;

const getTicket = async () => {
	let query = `query {
    nfts_aggregate {
      aggregate {
        max {
          ticket
        } 
      } 
    }
  }`;

	let result = await hasura.post({ query }).json();
  console.log(result);

	let {
		data: {
			nfts_aggregate: {
				aggregate: {
					max: { ticket }
				}
			}
		}
	} = result;

	if (!ticket) ticket = 0;
	return ++ticket;
};

let nfts = {
	ticket: {
		filename: 'QmSmQduTPXamJBQLTxVs2nZAkVYdRWk7K1gqtQyqsBmNo8',
		name: 'Silhouettes Ticket Stub'
	},
	poster: {
		filename: 'QmdkU6rYPwHX5u3nq2omFKDUhoF3vhuaVqptWdwtAmB72d',
		name: 'Silhouettes Constellation Poster'
	},
	artwork: {
		filename: 'QmPnGapuS63Vy5J7K1CupGaoUVPM493jyhqZkDRYoNY7e2',
		name: 'Silhouettes Special Edition Artwork'
	}
};

let createNft = async (type, { address, pubkey, ticket }) => {
	let domain = 'silhouettesthemovie.com';
	let { filename, name } = nfts[type];

	let result = await coinos
		.url('/assets')
		.post({
			address,
			pubkey,
			domain,
			filename,
			name,
			asset_amount: 1,
			precision: 0,
			ticker: type[0].toUpperCase() + ticket
		})
		.json();

	let { asset } = result;

	let query = `mutation ($nft: nfts_insert_input!) {
      insert_nfts_one(object: $nft) {
        id
      } 
    }`;

	let nft = {
		asset,
		ticket,
		type
	};

	result = await hasura.post({ query, variables: { nft } }).json();
};

app.get('/ticket', async (req, res) => {
	try {
		res.send(await getTicket());
	} catch (e) {
		console.log(e);
		res.send(false);
	}
});

app.post('/boom', async (req, res) => {
	try {
		let { amount: value, confirmed, text } = req.body;
		if (!subscribers[text]) throw new Error('no subscribers');

		let { amount, address, pubkey, paid } = invoices[text];
		if (paid) throw new Error('already paid');

		let ticket = await getTicket();

		if (confirmed && value >= amount) {
			invoices[text].paid = true;

			await createNft('ticket', { address, pubkey, ticket });

			if (ticket <= 1100) {
				await new Promise((r) => setTimeout(r, 2000));
				await createNft('poster', { address, pubkey, ticket });
			}

			if (ticket <= 100) {
				await new Promise((r) => setTimeout(r, 2000));
				await createNft('artwork', { address, pubkey, ticket });
			}
		}

		subscribers[text].send(JSON.stringify({ type: 'payment', value }));

		res.send(req.body);
	} catch (e) {
		console.log(e, e.stack);
		res.code(500).send(e.message);
	}
});

let getAmount = async () => {
	let { price } = await binance.query({ symbol: 'BTCUSDT' }).get().json().catch(console.log);
	return (ticketPrice / price).toFixed(8);
};

app.post('/BTC', async (req, res) => {
	let { address, pubkey } = req.body;
	let network = 'bitcoin';
	let amount = await getAmount();
	let { address: text } = await coinos
		.url('/address')
		.query({ network, type: 'bech32' })
		.get()
		.json();
	invoices[text] = { address, pubkey, amount };

	let invoice = {
		address: text,
		network,
		text,
		amount,
		webhook: 'http://172.17.0.1:8091/boom'
	};

	await coinos.url('/invoice').post({ invoice }).json();

	return { address: text, amount };
});

app.post('/LBTC', async (req, res) => {
	let { address, pubkey } = req.body;
	let network = 'liquid';
	let amount = await getAmount();
	let { address: text, confidentialAddress } = await coinos
		.url('/address')
		.query({ network })
		.get()
		.json();
	invoices[text] = { address, amount, pubkey };

	await coinos
		.url('/invoice')
		.post({
			invoice: {
				address: confidentialAddress,
				unconfidential: address,
				network,
				text,
				amount,
				webhook: 'http://172.17.0.1:8091/boom'
			}
		})
		.json();

	return { address: text, amount };
});

app.post('/LNBTC', async (req, res) => {
	let { address, pubkey } = req.body;
	let network = 'lightning';
	let amount = await getAmount();
	let text = await coinos
		.url('/lightning/invoice')
		.post({ amount: Math.round(amount * 100000000) })
		.text()
		.catch(console.log);
	invoices[text] = { address, amount, pubkey };

	await coinos
		.url('/invoice')
		.post({
			invoice: {
				network,
				text,
				amount,
				webhook: 'http://172.17.0.1:8091/boom'
			}
		})
		.json();

	return { address: text, amount };
});

app.get('/hex/:txid', auth(), async (req, res) => {
	let { txid } = req.params;
	return electrs.url(`/tx/${txid}/hex`).get().text();
});

app.post('/taxi', auth(), async (req, res) => {
	return coinos.url('/taxi').post(req.body).json();
});

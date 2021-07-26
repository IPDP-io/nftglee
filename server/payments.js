const { coinos } = require('./api');
const { binance } = require('./api');
const ticketPrice = 20;

app.post('/boom', async (req, res) => {
	let { amount: value, confirmed, text } = req.body;

	if (!subscribers[text]) return res.code(500).send({ message: 'no subscribers' });

	if (confirmed && value >= invoices[text]) console.log('mint');
	subscribers[text].send(JSON.stringify({ type: 'payment', value }));

	res.send(req.body);
});

let getAmount = async () => {
	let { price } = await binance.query({ symbol: 'BTCUSDT' }).get().json().catch(console.log);
	return (ticketPrice / price).toFixed(8);
};

app.post('/BTC', async (req, res) => {
	let network = 'bitcoin';
	let amount = await getAmount();
	let { address } = await coinos.url('/address').query({ network, type: 'bech32' }).get().json();
	invoices[address] = { address: req.body.address, amount };

	let invoice = {
		address,
		network,
		text: address,
		amount,
		webhook: 'http://172.17.0.1:8091/boom'
	};

	await coinos.url('/invoice').post({ invoice }).json();

	return { address, amount };
});

app.post('/LBTC', async (req, res) => {
	let network = 'liquid';
	let amount = await getAmount();
	let { address, confidentialAddress } = await coinos
		.url('/address')
		.query({ network })
		.get()
		.json();
	invoices[address] = { address: req.body.address, amount };

	await coinos
		.url('/invoice')
		.post({
			invoice: {
				address: confidentialAddress,
				unconfidential: address,
				network,
				text: address,
				amount,
				webhook: 'http://172.17.0.1:8091/boom'
			}
		})
		.json();

	return { address, amount };
});

app.post('/LNBTC', async (req, res) => {
	let network = 'lightning';
	let amount = await getAmount();
	let text = await coinos.url('/lightning/invoice').post({ amount }).text().catch(console.log);
	invoices[text] = { address: req.body.address, amount };

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

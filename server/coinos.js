const { coinos } = require('./api');

app.post('/boom', async (req, res) => {
	let { amount: value, confirmed, text } = req.body;

  if (!subscribers[text]) return res.code(500).send({ message: "no subscribers" });

	if (confirmed && value >= invoices[text])
		subscribers[text].send(JSON.stringify({ type: 'payment', value }));
	else subscribers[text].send(JSON.stringify({ type: 'pending', value }));

	res.send(req.body);
});

app.post('/BTC', async (req, res) => {
	let network = 'bitcoin';
	let { amount } = req.body;
	let { address } = await coinos.url('/address').query({ network, type: 'bech32' }).get().json();
	invoices[address] = amount;

	let invoice = {
		address,
		network,
		text: address,
		amount,
		webhook: 'http://172.17.0.1:8091/boom'
	};

	await coinos.url('/invoice').post({ invoice }).json();

	return { address };
});

app.post('/LBTC', async (req, res) => {
	let network = 'liquid';
	let { amount } = req.body;
	let { address, confidentialAddress } = await coinos
		.url('/address')
		.query({ network })
		.get()
		.json();

	invoices[address] = amount;

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

	return { address };
});

app.post('/LNBTC', async (req, res) => {
	let network = 'lightning';
	let { amount } = req.body;

	let text = await coinos.url('/lightning/invoice').post({ amount }).text().catch(console.log);

	invoices[text] = amount;

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

	return { address: text };
});

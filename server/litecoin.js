const { btc } = require("./api");
const reverse = require('buffer-reverse');
const zmq = require('zeromq/v5-compat');
const { address: Address, networks, Block, Transaction } = require('litecoinjs-lib');

const { LITECOIN_BLOCK, LITECOIN_TX, NETWORK } = process.env;
const network = NETWORK === 'regtest' ? networks.litereg : networks.litecoin;

const zmqRawBlock = zmq.socket('sub');
zmqRawBlock.connect(LITECOIN_BLOCK);
zmqRawBlock.subscribe('rawblock');

const zmqRawTx = zmq.socket('sub');
zmqRawTx.connect(LITECOIN_TX);
zmqRawTx.subscribe('rawtx');

zmqRawTx.on('message', async (topic, message, sequence) => {
	try {
		let hex = message.toString('hex');

		let tx = Transaction.fromHex(hex);
		for (let i = 0; i < tx.outs.length; i++) {
			let { script, value } = tx.outs[i];
			if (!script) continue;

			let address;
			try {
				address = Address.fromOutputScript(script, network);
			} catch (e) {
				return;
			}

			if (invoices[address]) {
				await boom({ amount: value, asset: btc, confirmed: 0, hash: tx.getId(), text: address });
			}
		}
	} catch (e) {
		console.log(e);
	}
});

zmqRawBlock.on('message', async (topic, message, sequence) => {
	let block = Block.fromHex(message.toString('hex'));
	block.transactions.map((tx) => {
		let hash = reverse(tx.getHash()).toString('hex');
		let address = Object.keys(invoices).find((address) => invoices[address].hash === hash);
		if (address) {
			let amount = Math.round(invoices[address].amount * 100000000);
			boom({ amount, confirmed: 1, hash, text: address });
		}
	});
});

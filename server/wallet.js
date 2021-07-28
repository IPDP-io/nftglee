const fs = require('fs');
const { generateMnemonic, mnemonicToSeedSync } = require('bip39');
const { fromSeed } = require('bip32');
const { fromBase58 } = require('bip32');
const {
	address: Address,
	confidential,
	ECPair,
	Psbt,
	payments,
	networks,
	Transaction
} = require('@asoltys/liquidjs-lib');
const { Buffer } = require('buffer');
const reverse = require('buffer-reverse');
const network = networks.regtest;
const { electrs } = require('./api');

const nonce = Buffer.from('00', 'hex');
const MNEMONIC =
	'settle anxiety sport cluster media unveil honey topple absent puppy divorce mosquito';

const BTC = network.assetHash;
const DUST = 1000;
const FEE = 100;

const keypair = (mnemonic, pass) => {
	mnemonic = MNEMONIC;

	try {
		let seed = mnemonicToSeedSync(mnemonic);
		let key = fromSeed(seed, network).derivePath(`m/84'/0'/0'/0/0`);
		let { publicKey: pubkey, privateKey: privkey } = key;
		let base58 = key.neutered().toBase58();

		return { pubkey, privkey, seed, base58 };
	} catch (e) {
		throw new Error('Failed to generated keys with mnemonic');
	}
};

const p2wpkh = (key) => {
	if (!key) key = keypair();
	let { pubkey, seed } = key;

	let redeem = payments.p2wpkh({
		pubkey,
		network
	});

	return payments.p2sh({
		redeem,
		network
	});
};

const sign = (p, sighash = 1) => {
	let { privkey } = keypair();

	p.data.inputs.map((_, i) => {
		try {
			p = p.signInput(i, ECPair.fromPrivateKey(privkey), [sighash]).finalizeInput(i);
		} catch (e) {
			// console.log("failed to sign", e.message, i, sighash);
		}
	});

	return p;
};

const broadcast = async (p) =>
	electrs.url('/tx').body(p.extractTransaction().toHex()).post().text();

const mint = async (address) => {
	let out = p2wpkh();

	let utxos = await electrs.url(`/address/${address}/utxo`).get().json();

	let hex = await getHex(utxos[0].txid);
	let prevOut = await Transaction.fromHex(hex);

	let p = new Psbt()
		.addInput({
			hash: prevOut.getId(),
			index: utxos[0].vout,
			redeemScript: p2wpkh().redeem.output,
			nonWitnessUtxo: Buffer.from(hex, 'hex')
		})
		.addIssuance({
			assetAmount: 1,
			assetAddress: out.address,
			tokenAmount: 0,
			precision: 0,
			net: network
		})
		.addOutputs([
			{
				asset: BTC,
				nonce,
				script: out.output,
				value: 100000000 - FEE
			},
			{
				asset: BTC,
				nonce,
				script: Buffer.alloc(0),
				value: FEE
			}
		]);

	p = sign(p);

	await broadcast(p);
};

const getHex = async (txid) => {
	return electrs.url(`/tx/${txid}/hex`).get().text();
};

module.exports = { mint };

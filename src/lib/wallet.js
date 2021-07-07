import { Buffer } from 'buffer';
import wretch from 'wretch';

import cryptojs from 'crypto-js';

const parseVal = (v) => parseInt(v.slice(1).toString('hex'), 16);
const parseAsset = (v) => v.slice(1).toString('hex');

const server = wretch().url('/server');
const liquid = wretch().url('/api');
const electrs = wretch().url('http://localhost:3012');

const DUST = 1000;
const FEE = 50;
const SATS = 100000000;
const BTC = '5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225';

const nonce = Buffer.from('00', 'hex');

const sign = (p, sighash = 1) => {
	let { privkey } = keypair();

	p.data.inputs.map((_, i) => {
		try {
			p = p.signInput(i, ECPair.fromPrivateKey(privkey), [sighash]).finalizeInput(i);
		} catch (e) {
			console.log('failed to sign', e.message, i, sighash);
		}
	});

	return p;
};

let Address,
	confidential,
	ECPair,
	Psbt,
	payments,
	network,
	networks,
	Transaction,
	mnemonicToSeedSync,
	fromSeed;

export const setup = () => {
	({ Address, confidential, ECPair, Psbt, payments, network, networks, Transaction } = liquidjs);
	network = networks.regtest;
	({ mnemonicToSeedSync } = bip39);
	({ fromSeed } = bip32);
  console.log(mnemonicToSeedSync);
};

const getMnemonic = (mnemonic, pass) => {
	mnemonic = cryptojs.AES.decrypt(mnemonic, pass).toString(cryptojs.enc.Utf8);
	if (!mnemonic) throw new Error('Unable to decrypt mnmemonic');
	return mnemonic;
};

const singlesig = (key) => {
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

export const createWallet = (mnemonic, pass) => {
	try {
		if (!pass) pass = get(password);
		if (!mnemonic) mnemonic = getMnemonic();

		mnemonic = cryptojs.AES.encrypt(mnemonic, pass).toString();

		const key = keypair(mnemonic, pass);

		return {
			address: singlesig(key).address,
			mnemonic
		};
	} catch (e) {
		console.log(e);
		throw new Error('Failed to create wallet from mnemonic');
	}
};

export const keypair = (mnemonic, pass) => {
	mnemonic = getMnemonic(mnemonic, pass);

	try {
		let seed = mnemonicToSeedSync(mnemonic);
		let key = fromSeed(seed, network).derivePath(`m/84'/0'/0'/0/0`);
		let { publicKey: pubkey, privateKey: privkey } = key;
		let base58 = key.neutered().toBase58();

		return { pubkey, privkey, seed, base58 };
	} catch (e) {
		console.log(e);
		throw new Error('Failed to generate keys with mnemonic');
	}
};

export const p2wpkh = (key) => {
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

export const faucet = async (address) => {
	try {
		console.log('Sending 1 BTC to', address);

		let { result: tx } = await liquid
			.auth(`Basic ${btoa('admin1:123')}`)
			.post({
				method: 'sendtoaddress',
				params: [address, 1]
			})
			.json();

		console.log('Mining a block');

		await liquid
			.auth(`Basic ${btoa('admin1:123')}`)
			.post({
				method: 'generatetoaddress',
				params: [1, 'XFkbKaC8HKcgwMPVD5Zq3Tktio74dzMzi7']
			})
			.json();

		console.log('Waiting 5s for electrs to warm up');

		await new Promise((r) => setTimeout(r, 5000));
	} catch (e) {
		console.log(e);
	}
};

const getHex = async (txid) => {
	return electrs.url(`/tx/${txid}/hex`).get().text();
};

const utxos = () => {
	return electrs.url(`/address/${p2wpkh().address}/utxo`).get().json();
};

export const balance = async () =>
	Math.round(
		(await utxos()).filter((o) => o.asset === BTC).reduce((a, b) => a + b.value, 0) / SATS
	);

export const issue = async ({ address, domain, editions, file, name, ticker }, count) => {
	let out = p2wpkh();

	let utxo = (await utxos()).find((o) => o.asset === BTC);

	console.log(utxo.txid);

	let hex = await getHex(utxo.txid);
	let prevOut = await Transaction.fromHex(hex);
	let tx, txid;

	let contract = {
		entity: { domain },
		file,
		groups: {
			polaris: {
				firstGen: true
			}
		},
		issuer_pubkey: keypair().pubkey.toString('hex'),
		name,
		precision: 0,
		ticker,
		version: 0
	};

	for (let i = 0; i < count; i++) {
		let p = new Psbt();

		console.log('i', i);
		if (i > 0) {
			let index = tx.outs.findIndex(
				(o) =>
					parseAsset(o.asset) === BTC && o.script.toString('hex') === out.output.toString('hex')
			);

			if (index > -1) {
				let input = {
					index,
					hash: txid,
					nonWitnessUtxo: Buffer.from(hex, 'hex'),
					redeemScript: out.redeem.output
				};

				p.addInput({
					index,
					hash: txid,
					nonWitnessUtxo: Buffer.from(hex, 'hex'),
					redeemScript: out.redeem.output
				});

				utxo = { value: parseVal(tx.outs[index].value) };
			}
		} else {
			p.addInput({
				hash: utxo.txid,
				index: utxo.vout,
				redeemScript: p2wpkh().redeem.output,
				nonWitnessUtxo: Buffer.from(hex, 'hex')
			});
		}

		p.addIssuance({
			assetAmount: 1,
			assetAddress: out.address,
			tokenAmount: 0,
			precision: 0,
			net: network,
			contract
		}).addOutputs([
			{
				asset: BTC,
				nonce,
				script: out.output,
				value: utxo.value - FEE
			},
			{
				asset: BTC,
				nonce,
				script: Buffer.alloc(0),
				value: FEE
			}
		]);

		p = sign(p);

		tx = p.extractTransaction();
		hex = tx.toHex();
		txid = tx.getId();

		try {
			await electrs.url('/tx').body(hex).post().text();
		} catch (e) {
			console.log('error broadcasting', e.message);
			console.log(hex);
		}

		server.url('/watch').post({ txid }).json(console.log);
		let asset = tx.outs
			.map((o) => o.asset.slice(1).reverse().toString('hex'))
			.find((a) => a !== network.assetHash);

		server.url('/tokenize').post({ ship: 'polaris', asset });
	}
};

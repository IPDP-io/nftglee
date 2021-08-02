import { api } from '$lib/api';
import { Buffer } from 'buffer';

import cryptojs from 'crypto-js';

const parseVal = (v) => parseInt(v.slice(1).toString('hex'), 16);
const parseAsset = (v) => v.slice(1).toString('hex');

const DUST = 1000;
const FEE = 50;
const SATS = 100000000;

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
	generateMnemonic,
	ECPair,
	Psbt,
	payments,
	network,
	networks,
	Transaction,
	mnemonicToSeedSync,
	fromSeed;

let retries = 0;
export const setup = () => {
	if (
		(typeof liquidjs === 'undefined' ||
			typeof bip39 === 'undefined' ||
			typeof bip32 === 'undefined') &&
		retries < 5
	)
		return retries++ && setTimeout(setup, 1000);
	({
		address: Address,
		confidential,
		ECPair,
		Psbt,
		payments,
		network,
		networks,
		Transaction
	} = liquidjs);
	network = networks.regtest;
	({ generateMnemonic, mnemonicToSeedSync } = bip39);
	({ fromSeed } = bip32);
};

export const p2wpkh = (user) => {
	let { pubkey } = keypair(user);

	let redeem = payments.p2wpkh({
		pubkey,
		network
	});

	return payments.p2sh({
		redeem,
		network
	});
};

export const createWallet = () => {
	try {
		let mnemonic = generateMnemonic();

		return {
			address: p2wpkh({ mnemonic }).address,
			mnemonic
		};
	} catch (e) {
		console.log(e);
		throw new Error('Failed to create wallet from mnemonic');
	}
};

export const keypair = (user) => {
	try {
		let seed = mnemonicToSeedSync(user.mnemonic);
		let key = fromSeed(seed, network).derivePath(`m/84'/0'/0'/0/0`);
		let { publicKey: pubkey, privateKey: privkey } = key;
		let base58 = key.neutered().toBase58();

		return { pubkey, privkey, seed, base58 };
	} catch (e) {
		console.log(e);
		throw new Error('Failed to generate keys with mnemonic');
	}
};

export const withdraw = async ({ asset, txid, vout }, from, to) => {
	let hex = await api.auth(`Bearer ${from.token}`).url(`/hex/${txid}`).get().text();
	let sighashType = Transaction.SIGHASH_SINGLE | Transaction.SIGHASH_ANYONECANPAY;

	let p = new Psbt()
		.addInput({
			hash: txid,
			index: vout,
			redeemScript: p2wpkh(from).redeem.output,
			nonWitnessUtxo: Buffer.from(hex, 'hex'),
			sighashType
		})
		.addOutput({
			asset,
			nonce: Buffer.alloc(1),
			script: Address.toOutputScript(to, network),
			value: 1
		})
		.signInput(0, ECPair.fromPrivateKey(keypair(from).privkey), [sighashType])
		.finalizeInput(0);

	let result = await api
		.url('/taxi')
		.auth(`Bearer ${from.token}`)
		.post({ psbt: p.toBase64() })
		.json();

	return p;
};

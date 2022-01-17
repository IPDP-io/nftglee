const wretch = require('wretch');
const fetch = require('node-fetch');
wretch().polyfills({ fetch });
const Core = require('@asoltys/bitcoin-core');

const {
	COINOS_URL,
	COINOS_TOKEN,
	HASURA_SECRET,
	LIQUID_ELECTRS_URL,
	LITECOIN_TX,
	LITECOIN_BLOCK,
	NETWORK
} = process.env;

const ltc = new Core({
	host: '127.0.0.1',
	wallet: 'coinos',
	username: 'admin1',
	password: '123',
	network: NETWORK === 'regtest' ? 'regtest' : 'mainnet',
	port: NETWORK === 'regtest' ? 19443 : 9332,
	zmqrawblock: 'tcp://127.0.0.1:18506',
	zmqrawtx: 'tcp://127.0.0.1:18507'
});

const btc =
	NETWORK === 'regtest'
		? '5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225'
		: '6f0279e9ed041c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d';

const coinos = wretch().url(COINOS_URL).auth(`Bearer ${COINOS_TOKEN}`);

const binance = wretch().url('https://api.binance.com/api/v3/ticker/price');

const electrs = wretch().url(LIQUID_ELECTRS_URL);
const hbp = wretch().url('http://silhbp:3000');

const userApi = (headers) => wretch().url('http://silhasura:8080/v1/graphql').headers(headers);

const hasura = wretch()
	.url('http://silhasura:8080/v1/graphql')
	.headers({ 'x-hasura-admin-secret': HASURA_SECRET });

const registry = wretch().url("https://assets.blockstream.info/");

module.exports = { binance, btc, coinos, electrs, hbp, hasura, ltc, registry, userApi };

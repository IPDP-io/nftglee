const wretch = require('wretch');
const fetch = require('node-fetch');
wretch().polyfills({ fetch });
const Core = require('@asoltys/bitcoin-core');

const ltc = new Core({
	host: '127.0.0.1',
	wallet: 'coinos',
	username: 'admin1',
	password: '123',
	network: 'regtest',
	port: 19443,
	zmqrawblock: 'tcp://127.0.0.1:18506',
	zmqrawtx: 'tcp://127.0.0.1:18507'
});

const { COINOS_URL, COINOS_TOKEN, HASURA_SECRET, LIQUID_ELECTRS_URL, LITECOIN_TX, LITECOIN_BLOCK } = process.env;

const coinos = wretch().url(COINOS_URL).auth(`Bearer ${COINOS_TOKEN}`);

const binance = wretch().url('https://api.binance.com/api/v3/ticker/price');

const electrs = wretch().url(LIQUID_ELECTRS_URL);
const hbp = wretch().url('http://localhost:3400');

const userApi = (headers) => wretch().url('http://localhost:8080/v1/graphql').headers(headers);

const hasura = wretch()
	.url('http://localhost:8080/v1/graphql')
	.headers({ 'x-hasura-admin-secret': HASURA_SECRET });

module.exports = { binance, coinos, electrs, hbp, hasura, ltc, userApi };

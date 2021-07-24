const wretch = require('wretch');
const fetch = require("node-fetch");
wretch().polyfills({ fetch });

const { COINOS_URL, COINOS_TOKEN, HASURA_SECRET } = process.env;

const coinos = wretch()
	.url(COINOS_URL)
	.auth(`Bearer ${COINOS_TOKEN}`);

const binance = wretch()
		.url('https://api.binance.com/api/v3/ticker/price')

const electrs = wretch().url('http://localhost:3012');
const hbp = wretch().url('http://localhost:3400');

const hasura = wretch()
	.url('http://localhost:8080/v1/graphql')
	.headers({ 'x-hasura-admin-secret': HASURA_SECRET });

module.exports = { binance, coinos, electrs, hbp, hasura };

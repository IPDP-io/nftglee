const jwt = require('jsonwebtoken');
const { electrs, userApi, hasura, hbp } = require('./api');
const { HASURA_JWT } = process.env;
const fs = require('fs');

const parseCookie = (str) =>
	str
		.split(';')
		.map((v) => v.split('='))
		.reduce((acc, v) => {
			acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
			return acc;
		}, {});

let users = {};

loggedIn = async (req, res) => {
	let fail = () => res.code(401).send('Unauthorized');
	let { authorization } = req.headers;
	let token;

	if (authorization) token = authorization.split(' ')[1];
	else fail();

	let { key } = JSON.parse(HASURA_JWT);

	try {
		req.token = jwt.verify(token, key);
		let id = jwt.decode(token, key).sub;

		if (users[id]) req.user = users[id];
		else {
			let query = `query {
          currentuser {
            address,
            pubkey,
            mnemonic,
            display_name
          }
        }`;

			let result = await userApi(req.headers).post({ query }).json();
			let user = result.data.currentuser[0];
			user.email = user.display_name;
			users[user.id] = user;
			req.user = user;
		}
	} catch (e) {
		console.log(e.message);
		fail();
	}
};

auth = (preValidation = loggedIn) => ({ preValidation });

checkTicket = async (req, res) => {
	let fail = () => res.code(401).send('Unauthorized');

	if (
		new Date() < new Date(Date.UTC(2021, 7, 13, 7, 0, 0)) &&
		!req.user.email.includes('coinos.io')
	)
		fail();

	if (req.user.ticket && new Date() - req.user.ticket.lastChecked < 3000) {
		return;
	}

	let utxos = await electrs.url(`/address/${req.user.address}/utxo`).get().json();
	let tickets = nfts.map((t) => t.type === 'ticket' && t.asset).filter((t) => t);
	let assets = utxos.map((tx) => tx.asset);
	if (!assets.find((a) => tickets.includes(a))) fail();
};

const login = async (req, res) => {
	let { email, password } = req.body;

	let query = `query  users($email: String!) {
    users(where: {display_name: {_eq: $email}}, limit: 1) {
      address
      display_name
      mnemonic
    }
  }`;

	try {
		let user;
		let result = await hasura.post({ query, variables: { email } }).json();
		let { data } = result;

		if (data && data.users && data.users.length) {
			user = data.users[0];
			email = user.display_name;
		} else {
			throw new Error('user not found');
		}

		let response = await hbp.url('/auth/login').post({ email, password }).res();
		Array.from(response.headers.entries()).forEach(([k, v]) => res.header(k, v));

		let json = { ...(await response.json()), ...user };

		return res.send(json);
	} catch (e) {
		console.log(e);
		let msg = 'Login failed';
		if (e.message.includes('activated'))
			msg = 'Account not activated, check email for a confirmation link';
		res.code(401).send(msg);
	}
};

app.post('/login', login);

app.post('/activate', async (req, res) => {
	let { code, email } = req.body;

	let query = `query($email: citext!) {
      tickets(where: {email: {_eq: $email}}) {
        active
        ticket
      }
    }`;

	let response = await hasura
		.post({
			query,
			variables: {
				email
			}
		})
		.json();

	let { active, ticket } = response.data.tickets[0];

	if (!active) {
		if (code.length >= 6 && ticket.startsWith(code))
			response = await hbp.url('/auth/activate').query({ ticket }).get().res();
		else return res.code(500).send('Invalid code');
	}

	res.send(true);
});

app.post('/register', async (req, res) => {
	let { address, mnemonic, email, password } = req.body;

	try {
		let response = await hbp.url('/auth/register').post({ email, password }).json();

		let query = `mutation ($user: users_set_input!, $email: String!) {
      update_users(where: {display_name: {_eq: $email}}, _set: $user) {
        affected_rows 
      }
    }`;

		let result = await hasura
			.post({
				query,
				variables: {
					email,
					user: {
						address,
						mnemonic
					}
				}
			})
			.json();

		if (result.errors) {
			let deleteQuery = `mutation { 
        delete_users(where: { account: { email: { _eq: "${email}" } } }) 
        { 
          affected_rows 
        } 
      }`;

			await hasura.post({ query: deleteQuery }).json();
			if (result.errors.find((e) => e.message.includes('Unique')))
				throw new Error('Account already exists');
			throw new Error('There was an error during registration');
		}

		return res.send(response);
	} catch (e) {
		console.log(e);
		if (e.message.includes('Account')) res.code(500).send('Account already exists');
		else res.code(500).send(e.message);
	}
});

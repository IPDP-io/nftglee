const { hasura, hbp } = require('./api');
const { HASURA_JWT } = process.env;

auth = {
	preValidation(req, res, done) {
		let fail = () => res.code(401).send('Unauthorized');
		if (!req.headers.authorization) fail();
		let token = req.headers.authorization.split(' ')[1];
		if (!token) fail();
		let { key } = JSON.parse(HASURA_JWT);
		try {
			req.token = jwt.verify(token, key);
			done();
		} catch (e) {
			console.log(e.message);
			fail();
		}
	}
};

const login = async (req, res) => {
	let { email, password } = req.body;
	let query = `query  users($email: String!) {
    users(where: {display_name: {_eq: $email}}, limit: 1) {
      display_name
    }
  }`;

	try {
		let user;
		let { data } = await hasura.post({ query, variables: { email } }).json();

		if (data && data.users && data.users.length) {
			user = data.users[0];
			email = data.users[0].display_name;
		} else {
			throw new Error();
		}

		let response = await hbp.url('/auth/login').post({ email, password }).res();
		Array.from(response.headers.entries()).forEach(([k, v]) => res.header(k, v));

		let json = await response.json();
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
		let response = await hbp.url('/auth/register').post({ email, password }).res();

		let query = `mutation ($user: users_set_input!, $email: String!) {
      update_users(where: {display_name: {_eq: $email}}, _set: $user) {
        affected_rows 
      }
    }`;

		response = await hasura
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

		if (response.errors) {
			console.log(response.errors);
			let deleteQuery = `mutation { 
        delete_users(where: { account: { email: { _eq: "${email}" } } }) 
        { 
          affected_rows 
        } 
      }`;

			await hasura.post({ query: deleteQuery }).json();
			if (response.errors.find((e) => e.message.includes('Unique')))
				throw new Error('Account already exists');
			throw new Error('There was an error during registration');
		}

		return res.send({ success: true });

		// return await login(req, res);
	} catch (e) {
		console.log(e);
		if (e.message.includes('Account')) res.code(500).send('Account already exists');
		else res.code(500).send(e.message);
	}
});

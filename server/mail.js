const nodemailer = require('nodemailer');
const path = require('path');

const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT, SMTP_SENDER } = process.env;

let transport = nodemailer.createTransport({
	host: SMTP_HOST,
	port: SMTP_PORT,
	secure: true, // upgrade later with STARTTLS
	auth: {
		user: SMTP_USER,
		pass: SMTP_PASS
	}
});

app.post('/contact', async (req, res) => {
	try {
		await transport.sendMail({
			from: 'adam@coinos.io',
			to: 'asoltys@gmail.com',
			subject: 'Silhouettes contact',
			text: JSON.stringify(req.body)
		});
	} catch (err) {
		console.error('Unable to send email');
		console.error(err);
		return res.code(204).send();
	}

	res.send(true);
});

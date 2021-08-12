const nodemailer = require('nodemailer');
const path = require('path');

const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT, SMTP_SENDER } = process.env;

let params = {
	host: SMTP_HOST,
	port: SMTP_PORT,
	secure: true,
	auth: {
		user: SMTP_USER,
		pass: SMTP_PASS
	}
};

let transport = nodemailer.createTransport(params);

app.post('/contact', async (req, res) => {
	try {
		let { name, email, subject, message } = req.body;
		await transport.sendMail({
			from: SMTP_SENDER,
			to: `${SMTP_SENDER}; adam@coinos.io`,
			subject: 'Silhouettes Contact Form',
			html: `
        <p>Name: ${name}</p>
				<p>Email: ${email}</p>
        <p>Subject: ${subject}</p>
        <p>Message: ${message}</p>
      `,
			text: `
        Name: ${name}
				Email: ${email}
        Subject: ${subject}
        Message: ${message}
      `
		});
	} catch (err) {
		console.error('Unable to send email');
		console.error(err);
		return res.code(204).send();
	}

	res.send(true);
});

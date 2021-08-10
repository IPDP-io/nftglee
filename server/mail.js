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
		let { name, email, subject, message } = req.body;
		await transport.sendMail({
			from: 'adam@coinos.io',
			to: 'asoltys@gmail.com; test@coinos.io',
			subject: 'Silhouettes contact',
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

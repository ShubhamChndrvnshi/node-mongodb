/* eslint-disable linebreak-style */
const nodemailer = require("nodemailer");
var path = require("path");
const { constants } = require("./constants");
var ejs = require("ejs");
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
	host: process.env.EMAIL_SMTP_HOST,
	port: process.env.EMAIL_SMTP_PORT,
	// secure: process.env.EMAIL_SMTP_SECURE, // lack of ssl commented this. You can uncomment it.
	auth: {
		user: process.env.EMAIL_SMTP_USERNAME,
		pass: process.env.EMAIL_SMTP_PASSWORD
	}
});

const send = function (from, to, subject, html)
{
	// send mail with defined transport object
	// visit https://nodemailer.com/ for more options
	return transporter.sendMail({
		from: from, // sender address e.g. no-reply@xyz.com or "Fred Foo 👻" <foo@example.com>
		to: to, // list of receivers e.g. bar@example.com, baz@example.com
		subject: subject, // Subject line e.g. 'Hello ✔'
		//text: text, // plain text body e.g. Hello world?
		html: html // html body e.g. '<b>Hello world?</b>'
	});
};

const  testMail = function (email) {
	// transporter.template
	ejs.renderFile(path.resolve(__dirname, "..")+"/emails/test/html.ejs", { name: "surendra" }, function (err, data) {
		if (err) {
			console.log(err);
		} else {
			var mainOptions = {
				from: constants.confirmEmails.from,
				to: email,
				subject: "Account Activated",
				html: data
			};
			//console.log("html data ======================>", mainOptions.html);
	
			transporter.sendMail(mainOptions);
		}
	});

	
};

module.exports = {
	send: send,
	testMail: testMail,
};
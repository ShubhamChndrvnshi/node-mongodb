const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const send = function (msg)
{
	// const msg = {
	// 	from,
	// 	to,
	// 	subject, 
	// 	html
	// };
	return sgMail.send(msg);
};


module.exports = {send: send};
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const saveTokens = Joi.object().keys({
	ipAddress: Joi.string().required().messages({
		"any.required": "Ip address is required",
		"string.empty": "IP address can't be empty"
	}),
	MatchID: Joi.string().required().messages({
		"any.required": "MatchID is required",
		"string.empty": "MatchID can't be empty"
	})
});


module.exports = {
	saveTokens,
};
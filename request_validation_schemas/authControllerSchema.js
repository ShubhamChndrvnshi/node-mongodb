const Joi = require("joi");



// User login Schema
const loginSchema = Joi.object().keys({
	contact: [
		Joi.string().trim().lowercase().email().required().messages({
			"any.required": "Email is required",
			"string.email": "Invalid email address",
			"string.empty": "Email cannot be an empty field"
		}),
		Joi.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/).required().messages({
			"any.required": "Phone number is required",
			"string.pattern.base": "Phone is required with country code"
		})
	],
	password: Joi.string().trim().min(6).required().messages({
		"string.min": "Password must be 6 characters or greater.",
		"any.required": "Password is required",
		"string.empty": "Password cannot be an empty field"
	})
});



module.exports = { 
	loginSchema,
};
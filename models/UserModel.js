/* eslint-disable linebreak-style */
var mongoose = require("mongoose");

//New schema for registring user to buy token
var UserSchema = new mongoose.Schema({
	firstName: {type: String},
	lastName:  {type: String},
	status: {type: Boolean, default: 1},
	password: {type: String},
	country_code: {type: String},
	mobile: {type: String},
}, {timestamps: true});



module.exports = mongoose.model("User", UserSchema);
/* eslint-disable linebreak-style */
var mongoose = require("mongoose");

//New schema for registring user to buy token
var TokenSchema = new mongoose.Schema({
	status: {type: String, default: 1},
	ipAddress:  {type: String},
	MatchID:  {type: String},
}, {timestamps: true});



module.exports = mongoose.model("Token", TokenSchema);
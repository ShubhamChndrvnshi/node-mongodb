/* eslint-disable linebreak-style */
var mongoose = require("mongoose");

//New schema for registring user to buy token
var DomainSchema = new mongoose.Schema({
	ipAddress:  {type: String},
	Domain:  {type: String},
}, {timestamps: true});



module.exports = mongoose.model("Domain", DomainSchema);
/* eslint-disable linebreak-style */
var mongoose = require("mongoose");

//New schema for registring user to buy token
var gameDataSchema = new mongoose.Schema({
	MatchID: {type: Number},
	Channel: {type: String},
	Name: {type: String},
	Home: {type: String},
	Away: {type: String},
	Type: {type: String},
	League: {type: String},
	bid: {type: String},
	TimeStart: {type: String},
	NowPlaying: {type: Number},
	IsLive: {type: Number},
	State: {type: String},
	UTCTimeStart: {type: Date},
});



module.exports = mongoose.model("gameData", gameDataSchema);
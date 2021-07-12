const Tokens = require("../models/TokenModel");
const TokenSchema =  require("../request_validation_schemas/TokenSchema");
const apiResponse = require("../helpers/apiResponse");
const GameDataModel = require("../models/gameDataModel");
// const auth = require("../middlewares/jwt");
// const mongoose = require("mongoose");
// const constants = require("../helpers/constants");
const logger = require("../helpers/logger");
const cron = require("node-cron");
const axios = require("axios");
	

/**
 * Token store.
 * 
 * @param {string}      MatchID 
 * @param {string}      ipAddress
 * 
 * @returns {Object}
 */



exports.save = (req, res) => {
	let {error, value} = TokenSchema.saveTokens.validate(req.body,{abortEarly : false});
	if (error) {
		logger.error(error);
		let errorMessages = error.details.map(({ message }) => message);
		return apiResponse.validationError(res,errorMessages);
	}else{
		Tokens.updateOne(
			{
				ipAddress: value.ipAddress
			},{
				$set: {
					MatchID: value.MatchID 
				}
			},{
				new: true,
				upsert: true,
				rawResult: true
			},(err, doc)=>{
				if(err){
					logger.error("Error during inserting/updating:");
					logger.error(err);
				}
				return apiResponse.successResponseWithData(res,"Saved", doc);
			});
	}
};


cron.schedule("*/5 * * * *", saveGameData);

function saveGameData(){
	console.log("Insert data into DB");
	axios.get("https://ss247.life/demo/streaminfo.php")
		.then(async function (response) {
			await GameDataModel.deleteMany({}).then(()=>{},(err)=>console.log(err));
			await GameDataModel.insertMany(response.data.data.getMatches).then(()=>{},(err)=>console.log(err));
		})
		.catch(function (error) {
			logger.error(error);
		});
}
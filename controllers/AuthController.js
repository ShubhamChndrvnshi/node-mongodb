const UserModel = require("../models/UserModel");
const apiResponse = require("../helpers/apiResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authControllerSchema = require("../request_validation_schemas/authControllerSchema");
const logger = require("../helpers/logger");
const libphonenumber = require("libphonenumber-js");
// const mongoose = require("mongoose");





/**
 * User login.
 *
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */



exports.login = (req, res) => {
	try {
		// eslint-disable-next-line no-unused-vars
		const { error,value } = authControllerSchema.loginSchema.validate(req.body,{abortEarly : false});
		let query;
		if (error) {
			logger.error(error);
			let errorMessages = error.details.map(({ message }) => message);
			return apiResponse.validationError(res,errorMessages);
		}else {
			try{
				let result = libphonenumber.parsePhoneNumber(value.contact);
				if(result.isValid()){
					var country_code = "+"+result.countryCallingCode || "";
					var number = result.nationalNumber || "";
					query = { $or: [ {email : value.contact}, {country_code: country_code, mobile : number}, { mobile: value.contact }] };
				}
			}catch(err){
				console.log(err);
				query = {email : value.contact};
			}
			
			UserModel.findOne( query ).then(user => {
				if (user) {
					//Compare given password with db's hash.
					bcrypt.compare(value.password,user.password,function (err,same) {
						if(same){
							// Check User's account active or not.
							if(user.status) {
								//Prepare JWT token for authentication
								let userData = getJWTToken(user);
								const jwtPayload = userData;
								const jwtData = {
									expiresIn: process.env.JWT_TIMEOUT_DURATION,
								};
								const secret = process.env.JWT_SECRET;
								//Generated JWT token with Payload and secret.
								userData.token = jwt.sign(jwtPayload, secret, jwtData);
								return apiResponse.successResponseWithData(res,"Login Success.", userData);
							}else {
								return apiResponse.unauthorizedResponse(res, "Account is not active. Please contact admin.");
							}
						}else{
							logger.error(err);
							return apiResponse.unauthorizedResponse(res, "Invalid Email Id/Mobile number or Password");
						}
					});
				}else{
					return apiResponse.unauthorizedResponse(res, "Invalid Email Id/Mobile number or Password");
				}
			});
				
			
		}
	} catch (err) {
		logger.error(err);
		return apiResponse.ErrorResponse(res, err.message);
	}
};


function getJWTToken(user){
	let userData = {
		_id: user._id,
		first_name: user.first_name,
		last_name: user.last_name,
		email: user.email,
		role: user.role,
		profile: user.profile,
	};
	return userData;
}


//User logout
exports.logout = (req, res) => {
	try {
		let userData = {user: "fooooooooooo"};
		//Generated JWT token with Payload and secret.
		userData.token = jwt.sign({data: "foobar"}, "secret", { expiresIn: "1ms" });
		return apiResponse.successResponseWithData(res,"Logged Out.", userData);
		
	} catch (err) {
		logger.error(err);
		return apiResponse.ErrorResponse(res, err.message);
	}
};


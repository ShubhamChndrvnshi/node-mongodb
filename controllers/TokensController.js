const Tokens = require("../models/TokenModel");
const DomainModel = require("../models/DomainModel");
const TokenSchema = require("../request_validation_schemas/TokenSchema");
const apiResponse = require("../helpers/apiResponse");
const GameDataModel = require("../models/gameDataModel");
// const auth = require("../middlewares/jwt");
// const mongoose = require("mongoose");
// const constants = require("../helpers/constants");
const json2html = require("json2html");
const logger = require("../helpers/logger");
const cron = require("node-cron");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const cluster = require("cluster");
const publicIp = require('public-ip');
const {INSPECT_MAX_BYTES} = require("buffer");


if (! fs.existsSync(__dirname + "/../public/html")) {
    fs.mkdirSync(__dirname + "/../public/html", {recursive: true});
}

/**
 * Token store.
 * 
 * @param {string}      MatchID 
 * @param {string}      ipAddress
 * 
 * @returns {Object}
 */

exports.addDomain = (req, res) => {
    let ipadd = "127.1.1.1";

    (async () => { // console.log(await publicIp.v4());
        ipadd = await publicIp.v4();

        var item = [{
                ipAddress: ipadd,
                Domain: req.body.ipAddress
            }];

        DomainModel.insertMany(item, function (err, ress) {
            if (err) {
                logger.error(err);
                let errorMessages = err.details.map(({message}) => message);
                return apiResponse.validationError(ress, errorMessages);
            }

            return apiResponse.successResponseWithData(res, "Saved", ress);

        });


    })();

};


exports.getURL2 = (req, res) => {

    let ipadd = "127.1.1.1";
    (async () => { // console.log(await publicIp.v4());
        ipadd = await publicIp.v4();

        if (ipadd) {
            DomainModel.findOne({
                Domain: ipadd
            }, (err, tokenDoc) => {
                if (err) {
                    logger.error(err);
                }
                if (tokenDoc) {
                    GameDataModel.findOne({ // MatchID:req.body.MatchID,
                        MatchID: req.query.MatchID
                    }, (err, doc) => {
                        if (err) {
                            logger.error(err);
                        }
                        if (doc) {
                            if (doc.IsLive) {
                                let url = `${
                                    process.env.BASE_URL
                                }/Nstreamapi.php?chid=${
                                    doc.Channel
                                }&ip=${ipadd}`;
                                console.log(url);
                                axios.get(url).then(async function (response) { // console.log("Sucess",response);
                                    let htmlFile = req.query.MatchID + ".html";
                                    await checkFileExists(htmlFile, response.data);
                                    /*	let resPath = path.resolve(__dirname+"/../public/html/"+htmlFile);
									const fdata = fs.readFileSync(resPath,'utf8');*/
                                    let file = process.env.SERVER_URL + "/html/" + htmlFile;
                                    return apiResponse.successResponse(res, file);

                                }).catch(function (error) {
                                    return apiResponse.ErrorResponse(res, error.message);

                                });
                            } else { // const fdata = fs.readFileSync( path.resolve(__dirname+"/../public/notLiveMatch.html"),'utf8');
                                return apiResponse.successResponse(res, `${
                                    process.env.SERVER_URL
                                }/notLiveMatch.html`);
                                // return apiResponse.successResponse(res,fdata);
                            }
                        } else {
                            return apiResponse.successResponse(res, `${
                                process.env.SERVER_URL
                            }/404noMatchID.html`);


                            // const fdata = fs.readFileSync( path.resolve(__dirname+"/../public/404noMatchID.html"),'utf8');

                            // return apiResponse.successResponse(res,fdata);
                        }
                    });
                } else {

                    return apiResponse.successResponse(res, `${
                        process.env.SERVER_URL
                    }/404-IP.html`);
                    // const fdata = fs.readFileSync( path.resolve(__dirname+"/../public/404-IP.html"),'utf8');

                    // return apiResponse.successResponse(res,fdata);
                }
            });
        } else {
            return apiResponse.ErrorResponse(res, "ipAddress is required");
        }
    })();

};


exports.save = (req, res) => {
    let {error, value} = TokenSchema.saveTokens.validate(req.body, {abortEarly: false});
    if (error) {
        logger.error(error);
        let errorMessages = error.details.map(({message}) => message);
        return apiResponse.validationError(res, errorMessages);
    } else {
        Tokens.updateOne({
            ipAddress: value.ipAddress
        }, {
            $set: {
                MatchID: value.MatchID
            }
        }, {
            new: true,
            upsert: true,
            rawResult: true
        }, (err, doc) => {
            if (err) {
                logger.error("Error during inserting/updating:");
                logger.error(err);
            }
            return apiResponse.successResponseWithData(res, "Saved", doc);
        });
    }
};


exports.getURL = (req, res) => {

    let ipadd = GetIPAddress(req);


    if (ipadd) {
        DomainModel.findOne({
            Domain: ipadd
        }, (err, tokenDoc) => {
            if (err) {
                logger.error(err);
            }
            if (tokenDoc) {
                GameDataModel.findOne({
                    MatchID: req.body.MatchID
                }, (err, doc) => {
                    if (err) {
                        logger.error(err);
                    }
                    if (doc) {
                        if (doc.IsLive) {
                            let url = `${
                                process.env.BASE_URL
                            }/Nstreamapi.php?chid=${
                                doc.Channel
                            }&ip=${ipadd}`;
                            console.log(url);
                            axios.get(url).then(async function (response) { // console.log("Sucess",response);
                                let htmlFile = req.body.MatchID + ".html";
                                await checkFileExists(htmlFile, response.data);
                                let file = process.env.SERVER_URL + "/html/" + htmlFile;
                                return apiResponse.successResponse(res, file);
                            }).catch(function (error) {
                                return apiResponse.ErrorResponse(res, error.message);
                            });
                        } else {
                            return apiResponse.successResponse(res, `${
                                process.env.SERVER_URL
                            }/notLiveMatch.html`);
                        }
                    } else {
                        return apiResponse.successResponse(res, `${
                            process.env.SERVER_URL
                        }/404noMatchID.html`);
                    }
                });
            } else {
                return apiResponse.successResponse(res, `${
                    process.env.SERVER_URL
                }/404-IP.html`);
            }
        });
    } else {
        return apiResponse.ErrorResponse(res, "ipAddress is required");
    }
};

// Check file exists or create
async function checkFileExists(filename, data) {
    let resPath = path.resolve(__dirname + "/../public/html/" + filename);
    if (!(fs.existsSync(resPath))) {
        fs.writeFileSync(resPath, data, {encoding: "utf8"});
    }
    return resPath;
}


function GetIPAddress(req) {
    var ip;
    if (req.headers['x-forwarded-for']) {
        ip = req.headers['x-forwarded-for'].split(",")[0];
    } else if (req.connection && req.connection.remoteAddress) {
        ip = req.connection.remoteAddress;
    } else {
        ip = req.ip;
    }

    (async () => {
        ip = await publicIp.v4();
        // => '46.5.21.123
    })();

    return ip;
}

if (cluster.isMaster) {
    cron.schedule(process.env.CRON, saveGameData);
}

function saveGameData() {
    console.log("Insert data into DB");
    axios.get(process.env.BASE_URL + "/streaminfo.php").then(async function (response) {
        await GameDataModel.deleteMany({}).then(() => {}, (err) => console.log(err));
        await GameDataModel.insertMany(response.data.data.getMatches).then(() => {}, (err) => console.log(err));
        let temp = [];
        response.data.data.getMatches.forEach((match => {
            if (match.IsLive) {
                temp.push({
                    MatchID: match.MatchID,
                    Name: match.Name,
                    UTCTimeStart: match.UTCTimeStart,
                    IsLive: match.IsLive,
                    TimeStart: match.TimeStart
                });
            }
        }));
        fs.writeFileSync(__dirname + "/../public/liveMatches.html", json2html.render(temp), {encoding: "utf8"});
    }).catch(function (error) {
        logger.error(error);
    });
}

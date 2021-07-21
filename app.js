//Imports
var express = require("express");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var cors = require("cors");
var i18n = require("i18n");
var mongoose = require("mongoose");
var path = require("path");
require("dotenv").config();
var compression = require("compression");
const winston = require("./helpers/logger");

//Routes
var indexRouter = require("./routes/index");
var apiRouter = require("./routes/api");
var apiResponse = require("./helpers/apiResponse");
// DB connection

var MONGODB_URL = process.env.MONGODB_URL;
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
	//don't show the log when it is test
	if(process.env.NODE_ENV !== "test") {
		winston.info(`Connected to ${MONGODB_URL}`);
		winston.info("App is running ... ");
		winston.info("Press CTRL + C to stop the process. ");
	}
})
	.catch(err => {
		winston.error("App starting error:"+ err.message);
		process.exit(1);
	});

var app = express();

app.use(compression({ filter: shouldCompress }));
 
function shouldCompress (req, res) {
	if (req.headers["x-no-compression"]) {
		// don't compress responses with this request header
		return false;
	}
	// fallback to standard filter function
	return compression.filter(req, res);
}

//To allow cross-origin requests
app.use(cors());

i18n.configure({
	locales:["en"],
	directory: __dirname + "/locales",
	register: global,
	defaultLocale: "en",
});

app.use(require("./helpers/httpLogger"));
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(i18n.init);
const language = function(req, res, next) {
	//console.log(req.body.currentLang);
	req.locale ? i18n.setLocale(req.locale) : null;
	console.log(req.locale);
	next();
};
app.use(language);

app.use(session({ secret: "SECRET", resave: true,
	saveUninitialized: true }));


//Route Prefixes
app.use("/", indexRouter);
app.use("/api/", apiRouter);


// throw 404 if URL not found
app.all("*", function(req, res) {
	res.sendFile(path.join(__dirname+ "/public/404.html"));
});

// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
	if (err.name === "UnauthorizedError") {
		return apiResponse.unauthorizedResponse(res, err.message);
	}
});


module.exports = app;

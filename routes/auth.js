/* eslint-disable linebreak-style */
var express = require("express");
const AuthController = require("../controllers/AuthController");

var router = express.Router();

router.post("/login", AuthController.login);


module.exports = router;
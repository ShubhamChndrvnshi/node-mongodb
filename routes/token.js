var express = require("express");
const TokensController = require("../controllers/TokensController");

 
var router = express.Router();

router.post("/", TokensController.save);

router.post("/getUrl", TokensController.getURL);

module.exports = router;
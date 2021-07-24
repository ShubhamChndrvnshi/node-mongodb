var express = require("express");
const TokensController = require("../controllers/TokensController");

 
var router = express.Router();

router.post("/", TokensController.save);

router.post("/getUrl", TokensController.getURL);

router.get("/live/matches", TokensController.getLiveMatches);

module.exports = router;
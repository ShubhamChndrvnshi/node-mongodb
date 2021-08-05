var express = require("express");
const TokensController = require("../controllers/TokensController");

 
var router = express.Router();

router.post("/", TokensController.save);

router.post("/getUrl", TokensController.getURL);

router.get("/getUrl2", TokensController.getURL2);


router.post("/addDomain", TokensController.addDomain);

module.exports = router;
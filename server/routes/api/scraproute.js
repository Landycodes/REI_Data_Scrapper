const router = require("express").Router();
const { scrapData, testServer } = require("../../controllers/scrapcontroller");

router.route("/").get(testServer).post(scrapData);

module.exports = router;

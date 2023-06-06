const router = require("express").Router();
const { scrapData } = require("../../controllers/scrapcontroller");

router.route("/").post(scrapData);

module.exports = router;

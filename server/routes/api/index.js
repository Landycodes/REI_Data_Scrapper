const router = require("express").Router();
const scrapper = require("./scraproute");

router.use("/scrap", scrapper);

module.exports = router;

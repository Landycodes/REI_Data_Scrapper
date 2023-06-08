const router = require("express").Router();
// const path = require("path");
const apiRoutes = require("./api");

router.use("/api", apiRoutes);
router.use("/", (req, res) =>
  res.send("Server running, make a request to /api/scrap")
);

// serve up react front-end in production
// router.use((req, res) => {
//   res.sendFile(path.join(__dirname, "../../client/build/index.html"));
// });

module.exports = router;

const getDataFor = require("../utils/scrapper");

module.exports = {
  async scrapData({ body }, res) {
    res.setHeader("Content-Type", "application/json");

    const data = await getDataFor(body.search, (result, dataArray) => {
      if (result) {
        res.write(JSON.stringify(result) + "\n");
      } else {
        res.write(JSON.stringify(dataArray) + "\n");
        res.end();
      }
    });

    if (!data) {
      res.status(400).json("couldnt find your search :(");
    }
  },
  async testServer(req, res) {
    console.log("Server has been pinged");
    res.send("server is up and running :)");
  },
};

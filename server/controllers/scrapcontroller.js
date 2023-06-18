const getDataFor = require("../utils/scrapper");

module.exports = {
  async scrapData({ body }, res) {
    const data = await getDataFor(body.search);

    if (!data) {
      res.status(400).json("couldnt find your search :(");
    }

    return res.json(data);
  },
  async testServer(req, res) {
    console.log("Server has been pinged");
    res.send("server is up and running :)");
  },
};

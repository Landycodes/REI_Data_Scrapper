const getDataFor = require("../utils/scrapper");

module.exports = {
  async scrapData({ body }, res) {
    const data = await getDataFor(body.search);

    if (!data) {
      res.status(400).json("something went wrong :(");
    }

    return res.json(data);
  },
  async testServer(req, res) {
    res.send("server is up and running :)");
  },
};

const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../client/build")));
// }
const corsOptions = {
  origin: [
    "http://localhost:3001",
    "http://localhost:3000",
    "https://rei-scrape-server.onrender.com",
  ],
};
app.use(cors(corsOptions));
app.use(routes);

app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));

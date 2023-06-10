const puppeteer = require("puppeteer");
require("dotenv").config();

//////////////SCRAPPER NOT RUNNING ON DEPLOYMENT
/////////////////////VERCEL RUNNING SERVER BUT CANT FIND HTML PAGE
const getDataFor = async (search) => {
  const executablePath =
    process.env.NODE_ENV === "production"
      ? process.env.PUPPETEER_EXECUTABLE_PATH
      : puppeteer.executablePath();

  //launches puppeteer
  const browser = await puppeteer.launch({
    headless: true, //true
    executablePath,
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    ignoreHTTPSErrors: true,
  });

  try {
    console.log("Opening the browser......");
    const page = await browser.newPage();

    await Promise.all([
      page.goto("https://www.bestplaces.net/"),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
      page.waitForSelector("#txtSearch"),
    ]);

    console.log("typing search.......");
    await page.type("#txtSearch", search);

    //clicks the search button and waits for content to load
    console.log("clicking enter......");
    await Promise.all([
      page.waitForNavigation({ waitUntil: "domcontentloaded" }),
      page.click("#btnSearch"),
    ]);

    console.log("checking for page title......");
    const titleElement = await page.$("p.card-title.text-center");
    if (!titleElement) {
      browser.close();
      return {
        search: search,
        uhOh: "Search failed, try again",
      };
    } else {
      //query selectors drills into page via css selectors and grabs data in the text
      console.log("scanning first page......");
      const data = await page.evaluate(() => {
        const title = document.querySelector(
          "p.card-title.text-center"
        ).textContent;
        const rowData = document.querySelector(".row:nth-child(5)");
        const boxData = rowData.querySelectorAll("div > p");
        const population = boxData[1].innerText;
        const popGrowth = boxData[2].innerText;
        const unEmploy = boxData[4].innerText;
        const MHV = boxData[6].innerText;

        //all data collected from this page added to object
        const dataObj = {
          Location: title,
          Population: population,
          PopulationGrowth: popGrowth,
          MedianHouseValue: MHV,
          Unemployment: unEmploy,
        };

        console.log("data retrieved!");
        return dataObj;
      });

      //click home stats page and wait for content to load
      console.log("clicking homeStats page....");
      await page.waitForSelector(".list-group > li:nth-child(17) > a");
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle0" }),
        page.click(".list-group > li:nth-child(17) > a"),
      ]);
      //reads content on home stats page and returns data for object
      console.log("scanning homeStats page......");
      const homeData = await page.evaluate(() => {
        const tableData = document.querySelector(
          ".table-responsive > table > tbody"
        );

        const houseGrowth = tableData.querySelector(
          "tr:nth-child(5) > td:nth-child(2)"
        ).innerText;

        const threeBedAv = document.querySelector(
          "g:nth-child(2) > text > tspan"
        ).textContent;

        const VacancyRate = tableData.querySelector(
          "tr:nth-child(14) > td:nth-child(2)"
        ).innerText;

        const renterPop = document
          .querySelector("h6.mt-3.mb-0")
          .nextSibling.textContent.replace(/[^0-9.%]/g, "")
          .trim();

        const dataObj = {
          MHV_Growth: houseGrowth,
          ThreeBedRent: threeBedAv,
          VacancyRate: VacancyRate,
          PercentOfRenters: renterPop,
        };

        console.log("data retrieved!");
        return dataObj;
      });

      const reiData = {
        Location: data.Location,
        Population: data.Population,
        PopulationGrowth: data.PopulationGrowth,
        MedianHouseValue: data.MedianHouseValue,
        MHV_Growth: homeData.MHV_Growth,
        ThreeBedRent: homeData.ThreeBedRent,
        VacancyRate: homeData.VacancyRate,
        PercentOfRenters: homeData.PercentOfRenters,
        Unemployment: data.Unemployment,
      };

      console.log("object created!");
      return reiData;
    }
  } catch (err) {
    console.error("Something fucked up :/", err);
  } finally {
    console.log("closing browser......");
    await browser.close();
  }
};

// export default getDataFor;
module.exports = getDataFor;

//call function to test scrapper
// getDataFor("tucson az").then((data) => console.log(data));

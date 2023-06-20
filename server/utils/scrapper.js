const puppeteer = require("puppeteer");
require("dotenv").config();

const getDataFor = async (search, callback) => {
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

    // filtering http requests to only what is needed to collect data
    //only requests what is needed to gather data
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const requestType = request.resourceType();
      const contentType = request.headers()["content-type"];
      const requestUrl = request.url().toLowerCase();
      if (
        requestType === "image" ||
        contentType?.startsWith("image/") ||
        request.resourceType() === "stylesheet" ||
        request.resourceType() === "font" ||
        requestUrl.includes("bootstrap") ||
        requestUrl.includes("cs.js") ||
        request.resourceType() === "iframe" ||
        (requestType === "script" &&
          !requestUrl.includes("highcharts") &&
          !requestUrl.includes("jquery"))
      ) {
        // Block requests for images, stylesheets, and fonts
        request.abort();
      } else {
        // Allow all other requests
        request.continue();
      }
    });

    // Intercept requests for all targets created by the browser
    browser.on("targetcreated", async (target) => {
      if (target.type() === "page") {
        const page = await target.page();
        if (page) {
          await page.setRequestInterception(true);
        }
      }
    });

    const dataArray = [];
    let pageLoaded = {};
    for (i = 0; i < search.length; i++) {
      pageLoaded = { page: i + 1 };
      callback(pageLoaded);

      console.log(`scanning page ${[i + 1]} out of ${search.length}`);
      await Promise.all([
        page.goto("https://www.bestplaces.net/"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
        page.waitForSelector("#txtSearch"),
      ]);

      console.log("typing search.......");
      await page.type("#txtSearch", search[i]);

      //clicks the search button and waits for content to load
      console.log("clicking enter......");
      await Promise.all([
        page.waitForNavigation({ waitUntil: "domcontentloaded" }),
        page.click("#btnSearch"),
      ]);

      console.log("checking for page title......");
      const titleElement = await page.$("p.card-title.text-center");
      const nextResult = await page.$(
        "div.container > .row > .col-md-9 > p:nth-child(2) > a"
      );
      if (!titleElement && nextResult) {
        //click the first result that shows on the list
        console.log("clicking first result......");
        await Promise.all([
          page.waitForNavigation({ waitUntil: "domcontentloaded" }),
          page.click("div.container > .row > .col-md-9 > p:nth-child(2) > a"),
        ]);
        //grab elements on list an let user pick to run again with a fixed search
      } else if (!titleElement && !nextResult) {
        dataArray.push({
          Error: search[i],
        });
        continue;
      }
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
        const Income = boxData[6].innerText;
        const MHV = boxData[8].innerText;

        //all data collected from this page added to object
        const dataObj = {
          Location: title,
          Population: population,
          PopulationGrowth: popGrowth,
          AverageIncome: Income,
          MedianHouseValue: MHV,
          Unemployment: unEmploy,
        };

        console.log("data retrieved!");
        return dataObj;
      });

      //click home stats page and wait for content to load
      console.log("navigating to housing page....");
      await page.click(".list-group > li:nth-child(17) > a");
      await page.waitForSelector(".table-responsive > table > tbody");
      await page.waitForSelector("h6.mt-3.mb-0");

      //reads content on home stats page and returns data for object
      console.log("scanning housing page......");
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
        AverageIncome: data.AverageIncome,
        MedianHouseValue: data.MedianHouseValue,
        MHV_Growth: homeData.MHV_Growth,
        ThreeBedRent: homeData.ThreeBedRent,
        VacancyRate: homeData.VacancyRate,
        PercentOfRenters: homeData.PercentOfRenters,
        Unemployment: data.Unemployment,
      };

      console.log(`page ${[i + 1]} scan successful`);
      dataArray.push(reiData);
    }
    callback(null, dataArray);
    return dataArray;
  } catch (err) {
    console.error("Something fucked up :/", err);
  } finally {
    console.log("closing browser......");
    await browser.close();
  }
};

module.exports = getDataFor;

//call function to test scrapper
// getDataFor(["tucson az", "dallas tx"]).then((data) => console.log(data));
// const search = [
//   "New York City New York",
//   "Los Angeles California",
//   "Chicago Illinois",
//   "Houston Texas",
//   "Phoenix Arizona",
// ];
// getDataFor(search, (result, dataArray) => {
//   if (result) {
//     console.log(result);
//   } else {
//     console.log(dataArray);
//   }
// });

// New York City New York
// Los Angeles California
// Chicago Illinois
// Houston Texas
// Phoenix Arizona

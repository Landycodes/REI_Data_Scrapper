let Chromium = require("chrome-aws-lambda");

const getDataFor = async (search) => {
  let browser = null;

  try {
    //launches puppeteer opens bestplaces.net and enters search input
    browser = await Chromium.puppeteer.launch({
      args: [...Chromium.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: Chromium.defaultViewport,
      executablePath: await Chromium.executablePath, //AAWWWWWWWAWWWWAWWAW
      headless: false,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.goto("https://www.bestplaces.net/");
    await page.type("#txtSearch", search);

    //clicks the search button and waits for content to load
    await Promise.all([
      page.waitForNavigation({ waitUntil: "domcontentloaded" }),
      page.click("#btnSearch"),
    ]);

    const titleElement = await page.$("p.card-title.text-center");
    if (!titleElement) {
      browser.close();
      return {
        search: search,
        uhOh: "Search failed, try again",
      };
    } else {
      //query selectors drills into page via css selectors and grabs data in the text
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

        return dataObj;
      });

      //click home stats page and wait for content to load
      await Promise.all([
        page.waitForNavigation({ waitUntil: "domcontentloaded" }),
        page.click(".list-group > li:nth-child(17) > a"),
      ]);

      //reads content on home stats page and returns data for object
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

        return dataObj;
      });

      await browser.close();

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

      return reiData;
    }
  } catch (err) {
    res.status(400).json(err);
    return;
  }
};

// export default getDataFor;
module.exports = getDataFor;

//call function to test scrapper
// getDataFor("tucson az").then((data) => console.log(data));

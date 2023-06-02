const puppeteer = require("puppeteer");

const getDataFor = async (search) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.bestplaces.net/");
  await page.type("#txtSearch", search);

  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded" }),
    page.click("#btnSearch"),
  ]);

  //query selectors drills into page via css selectors and grabs data in the text
  const data = await page.evaluate(() => {
    const rowData = document.querySelector(".row:nth-child(5)");
    const boxData = rowData.querySelectorAll("div > p");
    const population = boxData[1].innerText;
    const popGrowth = boxData[2].innerText;
    const unEmploy = boxData[4].innerText;
    const MHV = boxData[6].innerText;
    const array = [];
    array.push("done");
    array.push(population);
    dataObj = {
      Population: population,
      PopulationGrowth: popGrowth,
      MedianHouseValue: MHV,
      MHV_Growth: "_#4",
      ThreeBedRent: "_#5",
      VacancyRate: "_#6",
      PercentOfRenters: "_#7",
      Unemployment: unEmploy,
    };

    return dataObj;
  });

  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded" }),
    page.click(".list-group > li:nth-child(17) > a"),
  ]);

  await browser.close();

  console.log(data);
};

getDataFor("tucson az");

// const test = document.querySelector('.row:nth-child(5)');
// const test2 = test.querySelectorAll('div > p');
// const test3 = test2[1].innerText;
// console.log(test3)
//  538,167

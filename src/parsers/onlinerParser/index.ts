import puppeteer = require("puppeteer");

const getPage = async (url: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  const content = page.content();
  return content;
};

export const getModels = async () => {
  const res = await getPage("https://ab.onliner.by/");
  const modelsData = res.match(/var\s+Manufactures \= \[.*\]/g);
  const arrayOfModels = modelsData[0].match(/[{][^\}]*[}]/g);
  for (let indexOFCar = 0; indexOFCar < arrayOfModels.length; indexOFCar++) {
    arrayOfModels[indexOFCar] = JSON.parse(arrayOfModels[indexOFCar]);
  }
  return arrayOfModels;
};

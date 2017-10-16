import puppeteer = require('puppeteer');

const getPage = async (url: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  const content = page.content();
  return content;
};

export const getMarks = async () => {
  const res = await getPage(`https://ab.onliner.by/`);
  const modelsData = res.match(/var\s+Manufactures \= \[.*\]/g);
  const arrayOfMarks = modelsData[0].match(/[{][^\}]*[}]/g);
  for (let indexOFCar = 0; indexOFCar < arrayOfMarks.length; indexOFCar++) {
    arrayOfMarks[indexOFCar] = JSON.parse(arrayOfMarks[indexOFCar]);
  }
  return arrayOfMarks;
};

export const getModels = async (markID: number) => {
  const res = await getPage(
    `https://ab.onliner.by/#currency=USD&sort[]=last_time_up&page=1&car[0][${markID}]=`
  );
  const modelsData = res.match(/var\s+ManufacturesModel \= \[.*\]/g);
  const arrayOfModels = modelsData[0].match(/[{][^\}]*[}]/g);
  for (let indexOFCar = 0; indexOFCar < arrayOfModels.length; indexOFCar++) {
    arrayOfModels[indexOFCar] = JSON.parse(arrayOfModels[indexOFCar]);
  }
  return arrayOfModels;
};

import puppeteer = require('puppeteer');

const getPage = async (url: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  const content = page.content();
  return content;
};

export const trigger = () => {
  const res = getPage('https://ab.onliner.by/');
  res.then(ctx => console.log(ctx));
};

import axios from 'axios';
import FormData = require('form-data');
import fetch from 'node-fetch';
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
  // match manufactures
  const modelsData = res.match(/var\s+Manufactures \= \[.*\]/g);
  const arrayOfMarks = modelsData[0].match(/[{][^\}]*[}]/g);
  for (let indexOFCar = 0; indexOFCar < arrayOfMarks.length; indexOFCar++) {
    arrayOfMarks[indexOFCar] = JSON.parse(arrayOfMarks[indexOFCar]);
  }
  return arrayOfMarks;
};

export const getModels = async () => {
  const res = await getPage(`https://ab.onliner.by/`);
  // match manufactures models
  const modelsData: any = res.match(/var\s+ManufacturesModel \= \{.*\}/g);
  const models: any = modelsData[0].match(/\{.*\}/g);
  return JSON.parse(models[0]);
};

export const getBodyTypes = async () => {
  let res = await getPage(`https://ab.onliner.by/`);
  const bodyTypes: any = [];
  // remove all spaces for more comfort parsing
  res = res.replace(/ /g, '');
  // match all structure constructions of body types select
  const listOfTypes: any = res.match(
    /\<inputtype="checkbox"name="body_type\[\]"class="f-cb"value="\d+"\>[\r\n]*.*/g
  );
  for (const item of listOfTypes) {
    // match all types
    const typeMatch = item.match(/[А-Яа-я]*?(?=&)/g);
    // match type id for onliner
    const idMatch = item.match(/\d+/g);
    bodyTypes[idMatch[0]] = typeMatch[0];
  }
  return bodyTypes;
};

export const getAdsForCurrentModel = async (modelId: number) => {
  const carModel = 'car[0][' + modelId + ']';
  let count = 1;
  let response;
  const ads: any = {};
  do {
    const form = new FormData();
    form.append(carModel, '');
    form.append('currency', 'USD');
    form.append('page', count);
    form.append('sort[]', 'last_time_up');
    // rude hack
    response = await fetch('https://ab.onliner.by/search', { method: 'POST', body: form })
      .then(res => res.json())
      .then(json => json);
    if (response.result.advertisements) {
      Object.assign(ads, response.result.advertisements);
    }

    count++;
  } while (response.result.advertisements);

  return ads;
};
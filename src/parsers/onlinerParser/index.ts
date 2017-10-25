import axios from 'axios';
import FormData = require('form-data');
import * as _ from 'lodash';
import fetch from 'node-fetch';
import puppeteer = require('puppeteer');
import { codeErrors, ONLINER_URL } from '../../config/config';
import { ParserError } from '../../utils/errors/';

const getPage = async (url: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  const content = page.content();
  await browser.close();
  return content;
};

export const getMarks = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(ONLINER_URL, { waitUntil: 'networkidle' });
  const res = await page.content();

  // match manufactures
  const modelsData = res.match(/var\s+Manufactures \= \[.*\]/g);
  const arrayOfMathedMarks = modelsData[0].match(/[{][^\}]*[}]/g);
  const arrayOfMarks = arrayOfMathedMarks.map(mark => JSON.parse(mark));
  await browser.close();
  return arrayOfMarks;
};

export const getModels = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(ONLINER_URL, { waitUntil: 'networkidle' });
  const res: string = await page.content();
  // match manufactures models
  const modelsData: any = res.match(/var\s+ManufacturesModel \= \{.*\}/g);
  const models: any = modelsData[0].match(/\{.*\}/g);
  await browser.close();
  return JSON.parse(models[0]);
};

export const getBodyTypes = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(ONLINER_URL, { waitUntil: 'networkidle' });
  let res = await page.content();
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
  await browser.close();
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
    form.append('sort[]', '');
    try {
      response = await fetch(`https://ab.onliner.by/search`, { method: 'POST', body: form })
        .then(res => res.json())
        .then(json => json);
    } catch (e) {
      throw new ParserError(codeErrors.ONLINER_PARSE_ERROR);
    }

    let content = response.result.content;
    const newAds = response.result.advertisements;
    if (response.result.content) {
      // cause there is no positice look behind
      const descriptions = content.match(/\<p\>([^\<]*)/g);

      // fix cycle if string length === 0 string = next string
      descriptions.forEach((description: any, index: any) => {
        const match = description.match(/[^\<p\>]+/g);
        descriptions[index] = match[0];
      });
      content = content.replace(/ /g, '');
      const prices = content.match(/\d+?(?=\$)/g);
      const keys = Object.keys(newAds);
      keys.forEach((key, index) => {
        newAds[key].price = prices[index];
        newAds[key].description = descriptions[index];
      });
    }

    if (newAds) {
      Object.assign(ads, newAds);
    }

    count++;
  } while (response.result.advertisements);

  return ads;
};

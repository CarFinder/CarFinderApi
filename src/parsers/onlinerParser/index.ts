import axios from 'axios';
import cheerio = require('cheerio');
import FormData = require('form-data');
import * as _ from 'lodash';
import fetch from 'node-fetch';
import puppeteer = require('puppeteer');
import { codeErrors, ONLINER_URL } from '../../config/config';
import { ParserError } from '../../utils/errors/';

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
  const res = await page.content();
  const $ = cheerio.load(res, {
    normalizeWhitespace: true,
    xmlMode: true
  });
  const bodyTypes: any = $('li[class*="body_type-"]')
    .text()
    .replace(/["'&nbsp;\d]/g, '')
    .split(' ')
    .filter(el => el !== '');

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

    const newAds = response.result.advertisements;
    if (response.result.content) {
      const content = response.result.content;
      const $ = cheerio.load(content, {
        normalizeWhitespace: true,
        xmlMode: true
      });

      const descriptions = $('.carRow .txt p')
        .map(function() {
          return $(this).text();
        })
        .get();

      const prices = $('.cost-i .small')
        .text()
        .replace(/\$ (.*?) €/g, '-')
        .split('-')
        .map(el => el.trim())
        .filter(el => el !== '');

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

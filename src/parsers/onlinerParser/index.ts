import * as bluebird from 'bluebird';
import cheerio = require('cheerio');
import FormData = require('form-data');
import * as _ from 'lodash';
import * as request from 'request-promise';
import { codeErrors, ONLINER_URL, proxy } from '../../config/config';
import { ParserError } from '../../utils/errors/';

export const sendRequest = async (url: string): Promise<any> => {
  let response: any;
  let isFailed = true;
  let requestCount = 0;
  while (isFailed && requestCount !== 10) {
    try {
      response = await request.get({
        url
      });
      isFailed = false;
    } catch (err) {
      await bluebird.delay(1000);
      isFailed = true;
      requestCount += 1;
    }
  }
  return response;
};

export const getMarks = async () => {
  const res = await sendRequest(ONLINER_URL);

  // match manufactures
  const modelsData = res.match(/var\s+Manufactures \= \[.*\]/g);
  const arrayOfMathedMarks = modelsData[0].match(/[{][^\}]*[}]/g);
  const arrayOfMarks = arrayOfMathedMarks.map((mark: any) => JSON.parse(mark));
  return arrayOfMarks;
};

export const getModels = async () => {
  const res: string = await sendRequest(ONLINER_URL);
  // match manufactures models
  const modelsData: any = res.match(/var\s+ManufacturesModel \= \{.*\}/g);
  const models: any = modelsData[0].match(/\{.*\}/g);
  return JSON.parse(models[0]);
};

export const getBodyTypes = async () => {
  const res = await sendRequest(ONLINER_URL);
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
  const carModel = `car[0][${modelId}]`;
  let count = 1;
  let response: any;
  const ads: any = {};
  do {
    const form: any = {
      currency: 'USD',
      page: count,
      'sort[]': ''
    };
    form[`car[0][${modelId}]`] = '';
    try {
      response = await request.post({
        formData: form,
        json: true,
        uri: 'https://ab.onliner.by/search'
      });
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

      const prices = $('.price-primary')
        .map((i, el) => {
          return parseInt(
            $(el)
              .text()
              .replace(/\s/g, ''),
            10
          );
        })
        .get();

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

import cheerio = require('cheerio');
import * as request from 'request-promise';
import { AV_URL, codeErrors, proxy } from '../../config/config';
import { IAvMark } from '../../interfaces/parserInterface';
import { ParserError } from '../../utils/errors/';
import * as bluebird from 'bluebird';
import * as _ from 'lodash';

const Agent = require('socks5-https-client/lib/Agent');

export const getMarks = async () => {
  let response: any;
  try {
    response = await request.get({
      agentClass: Agent,
      agentOptions: {
        socksHost: 'localhost',
        socksPort: 9060
      },
      url: AV_URL
    });
    const $ = cheerio.load(response, {
      normalizeWhitespace: true,
      xmlMode: true
    });
    const marksURLs: string[] = $('.brandslist')
      .find('a')
      .map(function() {
        return $(this).attr('href');
      })
      .get()
      .slice(0, -1);
    const marksNames: string[] = $('.brandslist')
      .find('span')
      .map(function() {
        return $(this).text();
      })
      .get();

    const marks: any[] = _.map(marksNames, (name, index) => ({ name, url: marksURLs[index] }));
    return marks;
  } catch (e) {
    throw new ParserError(codeErrors.AV_PARSE_ERROR);
  }
};

export const getModels = async (marks: IAvMark[]) => {
  const get = (mark: any) => {
    return new Promise(resolve => {
      request
        .get({
          agentClass: Agent,
          agentOptions: {
            socksHost: 'localhost',
            socksPort: 9060
          },
          uri: mark.url
        })
        .then(response => {
          const $ = cheerio.load(response, {
            normalizeWhitespace: true,
            xmlMode: true
          });
          const modelsURLs: string[] = $('.brandslist')
            .find('a')
            .map(function() {
              return $(this).attr('href');
            })
            .get();
          const modelsNames: string[] = $('.brandslist')
            .find('span')
            .map(function() {
              return $(this).text();
            })
            .get();
          const models: any[] = _.map(modelsNames, (name, index) => ({
            name,
            url: modelsURLs[index]
          }));
          resolve({ [mark.name]: models });
        });
    });
  };

  let models: any[] = [];
  const date = new Date();
  for (let i = 0; i < marks.length; i += 3) {
    let currentMarks = _.slice(marks, i, i + 3);
    models = _.concat(
      models,
      await Promise.all(_.slice(
        [..._.map(currentMarks, get), bluebird.delay(1000)],
        0,
        -1
      ) as Promise<any>[])
    );
    global.console.log(`:::Loaded ${Math.round(models.length / marks.length * 100)}% of models`);
  }
  return models;
};

export const getBodyTypes = async () => {
  let response: any;
  try {
    response = await request.get({
      agentClass: Agent,
      agentOptions: {
        socksHost: 'localhost',
        socksPort: 9060
      },
      url: AV_URL
    });
    const $ = cheerio.load(response, {
      normalizeWhitespace: true,
      xmlMode: true
    });
    const bodyTypes: string[] = $('#body_id option')
      .map(function() {
        return $(this).text();
      })
      .get()
      .slice(1, -1);
    return bodyTypes;
  } catch (e) {
    throw new ParserError(codeErrors.AV_PARSE_ERROR);
  }
};

export const getAdsForCurrentModel = async (model: any) => {
  let response: any;
  try {
    response = await request.get({
      agentClass: Agent,
      agentOptions: {
        socksHost: 'localhost',
        socksPort: 9060
      },
      url: model.url
    });
    let $ = cheerio.load(response, {
      normalizeWhitespace: true,
      xmlMode: true
    });

    let pagesCount =
      +$('.pages-arrows-index')
        .text()
        .split(' ')
        .pop() || 1;

    let ads: any[] = [];

    for (let page = 1; page <= pagesCount; page++) {
      let response = await request.get({
        agentClass: Agent,
        agentOptions: {
          socksHost: 'localhost',
          socksPort: 9060
        },
        url: `${model.url}/page/${page}`
      });
      let $ = cheerio.load(response, {
        normalizeWhitespace: true,
        xmlMode: true
      });
      const adsURLs: string[] = $('.listing-item-image-in')
        .find('a')
        .map(function() {
          return $(this).attr('href');
        })
        .get();

      const get = (url: any) => {
        return new Promise(resolve => {
          request
            .get({
              agentClass: Agent,
              agentOptions: {
                socksHost: 'localhost',
                socksPort: 9060
              },
              uri: url
            })
            .then(response => {
              const $ = cheerio.load(response, {
                normalizeWhitespace: true,
                xmlMode: true
              });
              // car info
              const adInfo: string[] = $('.card-info')
                .find('dd')
                .map(function() {
                  return $(this)
                    .text()
                    .trim();
                })
                .get();
              // car images
              const imageUrl = 'https://static.av.by/public_images/big/';
              let images = response.match(/photos: \[.*\]/g);
              if (images) {
                images = images[0].match(/[{][^\}]*[}]/g);
                images = _.map(images, (image: any) => `${imageUrl}${JSON.parse(image).image}`);
              } else {
                images = [];
              }
              //car description
              const description: string = $('.js-card-description')
                .find('p')
                .text()
                .trim();
              let bodyType = _.capitalize(adInfo[6]);
              bodyType =
                bodyType === 'Легковой фургон'
                  ? bodyType
                  : _.chain(bodyType)
                      .split(' ')
                      .shift()
                      .value();
              const ad = {
                kms: +adInfo[2].split(' ').shift(),
                year: +adInfo[0],
                bodyType,
                images,
                description,
                model: model.name,
                sourceUrl: url,
                sourceName: 'av.by'
              };
              resolve(ad);
            });
        });
      };
      let pageAds: any[] = [];
      const date = new Date();
      for (let i = 0; i < adsURLs.length; i += 3) {
        let currentAds = _.slice(adsURLs, i, i + 3);
        pageAds = _.concat(
          pageAds,
          await Promise.all(_.slice(
            [..._.map(currentAds, get), bluebird.delay(1000)],
            0,
            -1
          ) as Promise<any>[])
        );
        global.console.log(
          `:::Loaded ${Math.round(pageAds.length / adsURLs.length * 100)}% of ads on page ${page}`
        );
      }
      ads = _.concat(ads, pageAds);
    }
    return ads;
  } catch (e) {
    throw new ParserError(codeErrors.AV_PARSE_ERROR);
  }
};

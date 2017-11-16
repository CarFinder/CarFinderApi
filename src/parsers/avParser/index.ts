import * as bluebird from 'bluebird';
import cheerio = require('cheerio');
import * as _ from 'lodash';
import * as request from 'request-promise';
import { AV_URL, codeErrors, proxy } from '../../config/config';
import { IAvMark } from '../../interfaces/parserInterface';
import { ParserError } from '../../utils/errors/';

// tslint:disable-next-line:no-var-requires
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
          const transformedModels: any[] = _.map(modelsNames, (name, index) => ({
            name,
            url: modelsURLs[index]
          }));
          resolve({ [mark.name]: transformedModels });
        });
    });
  };

  let models: any[] = [];
  const date = new Date();
  for (let i = 0; i < marks.length; i += 3) {
    const currentMarks = _.slice(marks, i, i + 3);
    models = _.concat(
      models,
      await Promise.all(_.slice(
        [..._.map(currentMarks, get), bluebird.delay(1000)],
        0,
        -1
      ) as Array<Promise<any>>)
    );
    global.console.log(
      `:::Loaded ${Math.round(models.length / marks.length * 100)}% of a av.by car models`
    );
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

    const pagesCount =
      +$('.pages-arrows-index')
        .text()
        .split(' ')
        .pop() || 1;

    let ads: any[] = [];

    for (let page = 1; page <= pagesCount; page++) {
      response = await request.get({
        agentClass: Agent,
        agentOptions: {
          socksHost: 'localhost',
          socksPort: 9060
        },
        url: `${model.url}/page/${page}`
      });
      $ = cheerio.load(response, {
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
              url
            })
            .then(res => {
              $ = cheerio.load(res, {
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
              const images: string[] = $('.fotorama')
                .find('a')
                .map(function() {
                  return $(this).attr('href');
                })
                .get();
              // car description
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
              const dates: string[] = $('.card-about-item-dates')
                .find('dd')
                .map(function() {
                  return $(this)
                    .text()
                    .trim();
                })
                .get();
              const transformedDates = _.chain(dates)
                .map(date =>
                  _.chain(date)
                    .split('.')
                    .reverse()
                    .map((item, i) => (i === 1 ? +item - 1 : +item))
                    .value()
                )
                .value();
              const price = +$('.card-price-approx')
                .text()
                .split(' ')
                .join('');
              const ad = {
                bodyType,
                creationDate: new Date(...transformedDates[0]),
                description,
                images,
                kms: +adInfo[2].split(' ').shift(),
                lastTimeUpDate: new Date(...(transformedDates[1] || transformedDates[0])),
                model: model.name,
                price,
                sourceName: 'av.by',
                sourceUrl: url,
                year: +adInfo[0]
              };
              resolve(ad);
            });
        });
      };
      let pageAds: any[] = [];
      for (let i = 0; i < adsURLs.length; i += 3) {
        const currentAds = _.slice(adsURLs, i, i + 3);
        pageAds = _.concat(
          pageAds,
          await Promise.all(_.slice(
            [..._.map(currentAds, get), bluebird.delay(1000)],
            0,
            -1
          ) as Array<Promise<any>>)
        );
        global.console.log(
          `:::Loaded ${Math.round(
            pageAds.length / adsURLs.length * 100
          )}% of ${model.name} ads on page ${page}`
        );
      }
      ads = _.concat(ads, pageAds);
    }
    return ads;
  } catch (e) {
    throw new ParserError(codeErrors.AV_PARSE_ERROR);
  }
};

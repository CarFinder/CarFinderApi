import * as bluebird from 'bluebird';
import cheerio = require('cheerio');
<<<<<<< HEAD
=======
// tslint:disable-next-line:no-var-requires
const _ = require('lodash');
>>>>>>> e3f1e7abeb14d5d3e51f5c4408f1e362fa5069d5
import * as request from 'request-promise';
import { AV_URL, codeErrors, proxy } from '../../config/config';
import { IAvMark } from '../../interfaces/parserInterface';
import { ParserError } from '../../utils/errors/';
import { transformBmvAvModel, transformMercedesAvModel } from '../../utils/parserUtils';

// tslint:disable-next-line:no-var-requires
const Agent = require('socks5-https-client/lib/Agent');
// tslint:disable-next-line:no-var-requires
const _ = require('lodash');

export const getMarks = async () => {
  let response: any;
  try {
    let isFailed = true;
    while (isFailed) {
      try {
        response = await request.get({
          agentClass: Agent,
          agentOptions: {
            socksHost: 'localhost',
            socksPort: 9060
          },
          uri: AV_URL
        });
        isFailed = false;
      } catch (err) {
        isFailed = true;
      }
    }
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
        let name = $(this).text();
        name = name === 'Mercedes-Benz' ? 'Mercedes' : name; // for consistency
        return name;
      })
      .get();

    const marks: any[] = _.map(marksNames, (name: any, index: number) => ({
      name,
      url: marksURLs[index]
    }));
    return marks;
  } catch (e) {
    throw new ParserError(codeErrors.AV_PARSE_ERROR);
  }
};

export const getModels = async (marks: IAvMark[]) => {
  try {
    const get = async (mark: any) => {
      let isFailed = true;
      let response;
      while (isFailed) {
        try {
          response = await request.get({
            agentClass: Agent,
            agentOptions: {
              socksHost: 'localhost',
              socksPort: 9060
            },
            uri: mark.url
          });
          isFailed = false;
        } catch (err) {
          isFailed = true;
        }
      }
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
      let transformedModels: any[];

      // for consistency
      if (mark.name === 'BMW') {
        transformedModels = _.map(modelsNames, (name: any, index: number) => {
          const transformedName = transformBmvAvModel(name);
          return {
            name: transformedName,
            url: modelsURLs[index]
          };
        });
      } else if (mark.name === 'Mercedes') {
        transformedModels = _.map(modelsNames, (name: any, index: number) => {
          const transformedName = transformMercedesAvModel(name);
          return {
            name: transformedName,
            url: modelsURLs[index]
          };
        });
      } else {
        transformedModels = _.map(modelsNames, (name: any, index: number) => ({
          name,
          url: modelsURLs[index]
        }));
      }

      return { [mark.name]: transformedModels };
    };

    let models: any[] = [];
    const date = new Date();
    for (let i = 0; i < marks.length; i += 3) {
      const currentMarks = _.slice(marks, i, i + 3);
      models = _.concat(
        models,
        // between each of the loop iteration we should be wait not less then 1 second
        // and after we can to continue
        await Promise.all(_.slice(
          // we take all of the promises results, exclude last, because last promise to return undefined value
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
  } catch (err) {
    throw new ParserError(codeErrors.AV_PARSE_ERROR);
  }
};

export const getBodyTypes = async () => {
  let response: any;
  try {
    let isFailed = true;
    while (isFailed) {
      try {
        response = await request.get({
          agentClass: Agent,
          agentOptions: {
            socksHost: 'localhost',
            socksPort: 9060
          },
          uri: AV_URL
        });
        isFailed = false;
      } catch (err) {
        isFailed = true;
      }
    }
    const $ = cheerio.load(response, {
      normalizeWhitespace: true,
      xmlMode: true
    });
    const bodyTypes: string[] = $('#body_id option')
      .map(function() {
        return $(this).text();
      })
      .get()
      .slice(1);
    return bodyTypes;
  } catch (e) {
    throw new ParserError(codeErrors.AV_PARSE_ERROR);
  }
};

export const getAdsForCurrentModel = async (model: any) => {
  let response: any;
  try {
    let isFailed = true;
    while (isFailed) {
      try {
        response = await request.get({
          agentClass: Agent,
          agentOptions: {
            socksHost: 'localhost',
            socksPort: 9060
          },
          uri: model.url
        });
        isFailed = false;
      } catch (err) {
        isFailed = true;
      }
    }

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
      isFailed = true;
      while (isFailed) {
        try {
          response = await request.get({
            agentClass: Agent,
            agentOptions: {
              socksHost: 'localhost',
              socksPort: 9060
            },
            uri: `${model.url}/page/${page}`
          });
          isFailed = false;
        } catch (err) {
          isFailed = true;
        }
      }

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

      const get = async (url: any) => {
        let res;
        isFailed = true;
        while (isFailed) {
          try {
            res = await request.get({
              agentClass: Agent,
              agentOptions: {
                socksHost: 'localhost',
                socksPort: 9060
              },
              url
            });
            isFailed = false;
          } catch (err) {
            isFailed = true;
          }
        }

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

        // car images
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

        if (adInfo[1] === 'новый') {
          adInfo.splice(2, 0, '0 км');
        }

        // car bodytype
        let bodyType = _.capitalize(adInfo[6]);
        bodyType =
          bodyType === 'Легковой фургон' // we take only first word of the bodytype name, exclude "Легковой фургон"
            ? bodyType
            : _.chain(bodyType)
                .split(' ')
                .shift()
                .value();

        // car update date
        const dates: string[] = $('.card-about-item-dates')
          .find('dd')
          .map(function() {
            return $(this)
              .text()
              .trim();
          })
          .get();
        const transformedDates = _.chain(dates)
          .map((date: any) =>
            _.chain(date)
              .split('.')
              .reverse()
              .map((item: any, i: number) => (i === 1 ? +item - 1 : +item))
              .value()
          )
          .value();
        const creationDate = new Date(...transformedDates[0]);
        const lastTimeUpDate = new Date(...(transformedDates[1] || transformedDates[0]));
        // car price
        const price = +$('.card-price-main')
          .find('span')
          .text()
          .trim()
          .replace(/\s/g, '')
          .slice(0, -2);

        const ad = {
          bodyType,
          creationDate,
          description,
          images,
          kms: +adInfo[2].split(' ').shift(),
          lastTimeUpDate,
          model: model.name,
          price,
          sourceName: 'av.by',
          sourceUrl: url,
          year: +adInfo[0]
        };

        return ad;
      };

      let pageAds: any[] = [];

      for (let i = 0; i < adsURLs.length; i += 3) {
        const currentAds = _.slice(adsURLs, i, i + 3); // we can to take only 3 ads per once time
        pageAds = _.concat(
          pageAds,
          // between each of the loop iteration we should be wait not less then 1 second
          // and after we can to continue
          await Promise.all(_.slice(
            // we take all of the promises results, exclude last, because last promise to return undefined value
            [..._.map(currentAds, get), bluebird.delay(1000)],
            0,
            -1
          ) as Array<Promise<any>>)
        );
        global.console.log(
          `:::Loaded ${Math.round(pageAds.length / adsURLs.length * 100)}% of ${
            model.name
          } ads on page ${page}`
        );
      }
      ads = _.concat(ads, pageAds);
    }

    return ads;
  } catch (e) {
    throw new ParserError(codeErrors.AV_PARSE_ERROR);
  }
};

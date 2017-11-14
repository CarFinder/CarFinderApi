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
          const models: string[] = $('.brandslist')
            .find('span')
            .map(function() {
              return $(this).text();
            })
            .get();
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
      await Promise.all(_.slice([..._.map(currentMarks, get), bluebird.delay(1000)], 0, -1))
    );
    global.console.log(`:::Loaded ${Math.round(models.length / marks.length * 100)}% of models`);
  }
  return models;
};

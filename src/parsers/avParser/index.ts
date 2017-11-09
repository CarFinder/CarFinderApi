import cheerio = require('cheerio');
import * as request from 'request-promise';
import { AV_URL, codeErrors, proxy } from '../../config/config';
import { IAvMark } from '../../interfaces/parserInterface';
import { ParserError } from '../../utils/errors/';

request.defaults({
  proxy: proxy.split(',')
});

export const getMarks = async () => {
  let response: any;
  try {
    response = await request.get({
      uri: AV_URL
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

    const marks: any[] = marksNames.map((name, index) => ({ name, url: marksURLs[index] }));
    return marks;
  } catch (e) {
    throw new ParserError(codeErrors.AV_PARSE_ERROR);
  }
};

// export const getModels = async (marks: IAvMark[]) => {

// };

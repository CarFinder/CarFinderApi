import { codeErrors } from '../../config/config';
import { IErrorData } from '../../interfaces';

export default class ParserError extends Error {
  public data: IErrorData;

  constructor(code?: number) {
    super();

    switch (code) {
      case codeErrors.ONLINER_PARSE_ERROR:
        this.data = {
          code: codeErrors.ONLINER_PARSE_ERROR,
          type: 'Parser Error'
        };
        break;
      case codeErrors.AV_PARSE_ERROR:
        this.data = {
          code: codeErrors.AV_PARSE_ERROR,
          type: 'Parser Error'
        };
        break;
    }
  }
}

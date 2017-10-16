import { codeErrors } from '../../config/config';
import { IErrorData } from '../../interfaces';

export default class RequestError extends Error {
  public data: IErrorData;

  constructor(code?: number) {
    super();
    switch (code) {
      case codeErrors.REQUIRED_FIELD:
        this.data = {
          code: codeErrors.REQUIRED_FIELD,
          type: 'Request Error'
        };
        break;
    }
  }
}

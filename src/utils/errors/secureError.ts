import { codeErrors } from '../../config/config';
import { IErrorData } from '../../interfaces';

export default class SecureError extends Error {
  public data: IErrorData;

  constructor(code?: number) {
    super();

    switch (code) {
      case codeErrors.INCORRECT_EMAIL_OR_PASS:
        this.data = {
          code: codeErrors.INCORRECT_EMAIL_OR_PASS,
          type: 'Auth error'
        };
        break;
      case codeErrors.AUTH_ERROR:
        this.data = {
          code: codeErrors.AUTH_ERROR,
          type: 'Auth error'
        };
        break;
      case codeErrors.ACCOUNT_NOT_ACTIVATED:
        this.data = {
          code: codeErrors.ACCOUNT_NOT_ACTIVATED,
          type: 'Auth error'
        };
        break;
      case codeErrors.JWT_DECODE_ERROR:
        this.data = {
          code: codeErrors.JWT_DECODE_ERROR,
          type: 'Secure error'
        };
        break;
      case codeErrors.VALIDATION_ERROR:
        this.data = {
          code: codeErrors.VALIDATION_ERROR,
          type: 'Auth error'
        };
      case codeErrors.SEND_EMAIL_ERROR:
        this.data = {
          code: codeErrors.SEND_EMAIL_ERROR,
          type: 'Auth error'
        };
    }
  }
}

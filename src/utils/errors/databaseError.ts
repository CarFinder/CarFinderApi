import * as HttpStatus from 'http-status-codes';
import { codeErrors } from '../../config/config';
import { IErrorData } from '../../interfaces';
export default class DatabaseError extends Error {
  public data: IErrorData;

  constructor(code: number, ...params: any[]) {
    super(...params);
    switch (code) {
      case codeErrors.MONGO_DUPLICATE_ERROR:
        this.data = {
          code: HttpStatus.CONFLICT,
          type: 'Registration Error'
        };
        break;
      case codeErrors.INTERNAL_DB_ERROR:
        this.data = {
          code: codeErrors.INTERNAL_DB_ERROR,
          type: 'Db error'
        };
        break;
    }
  }
}

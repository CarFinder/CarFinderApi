import { codeErrors } from '../../config/config';
import { IErrorData } from '../../interfaces';

export default class DatabaseError extends Error {
  public data: IErrorData;

  constructor(code: number, ...params: any[]) {
    super(...params);
    switch (code) {
      case codeErrors.MONGO_DUPLICATE_ERROR:
        this.data = {
          code: 409,
          type: 'Registration Error'
        };
        break;
    }
  }
}

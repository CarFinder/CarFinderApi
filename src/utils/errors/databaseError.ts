import { IErrorData } from '../../interfaces';

export default class DatabaseError extends Error {
  public data: IErrorData;

  constructor(code: number, ...params: any[]) {
    super(...params);
    switch (code) {
      case 11000:
        this.data = {
          code: 409,
          enMessage: 'Email is already in use',
          ruMessage: 'Пользователь с таким email уже зарегистрирован',
          type: 'Registration Error'
        };
        break;
    }
  }
}

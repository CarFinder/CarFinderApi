import { IErrorData } from '../../interfaces';

export default class AuthError extends Error {
  public data: IErrorData;

  constructor(code?: number) {
    super();

    switch (code) {
      case 101:
        this.data = {
          code: 101,
          enMessage: 'Invalid email or password',
          ruMessage: 'Неверное имя пользователя или пароль',
          type: 'Auth error'
        };
        break;
      case 102:
        this.data = {
          code: 102,
          enMessage: 'Authorization error',
          ruMessage: 'Ошибка авторизации',
          type: 'Auth error'
        };
        break;
    }
  }
}

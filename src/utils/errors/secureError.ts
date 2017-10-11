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
          enMessage: 'Invalid email or password',
          ruMessage: 'Неверное имя пользователя или пароль',
          type: 'Auth error'
        };
        break;
      case codeErrors.AUTH_ERROR:
        this.data = {
          code: codeErrors.AUTH_ERROR,
          enMessage: 'Authorization error',
          ruMessage: 'Ошибка авторизации',
          type: 'Auth error'
        };
        break;
      case codeErrors.ACCOUNT_NOT_ACTIVATED:
        this.data = {
          code: codeErrors.ACCOUNT_NOT_ACTIVATED,
          enMessage: 'Account not activated',
          ruMessage: 'Аккаунт не активирован',
          type: 'Auth error'
        };
        break;
      case codeErrors.JWT_DECODE_ERROR:
        this.data = {
          code: codeErrors.JWT_DECODE_ERROR,
          enMessage: 'Token is invalid',
          ruMessage: 'Токен не валиден',
          type: 'Secure error'
        };
        break;
    }
  }
}

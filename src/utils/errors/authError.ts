export default class AuthError extends Error {
  public data: object;

  constructor(code?: number) {
    super();
    switch (code) {
      case 101:
        this.data = {
          code: 101,
          enMessage: 'Invalid email or password',
          ruMessage: 'Неверное имя пользователя или пароль'
        };
        break;
      case 102:
        this.data = {
          code: 102,
          enMessage: 'Authorization error',
          ruMessage: 'Ошибка авторизации'
        };
    }
  }
}

export default class DatabaseError extends Error {
  public message: string;

  constructor(code: number, ...params: any[]) {
    super(...params);
    if (code === 11000) {
      this.message = 'Account with this email already exist';
    }
  }
}

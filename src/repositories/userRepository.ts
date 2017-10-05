import User from '../db/schemas/user';
import { IUser } from '../interfaces/index';

export const create = async (user: IUser) => {
  const newcomer = new User(user);
  const err = await newcomer.save(error => {
    return error as any;
  });
  if (err) {
    return err as any;
  }
};

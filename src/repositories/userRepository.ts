import { User } from '../db/index';
import { IUser } from '../interfaces/index';

export const create = async (user: IUser) => {
  const newcomer = new User(user);
  await newcomer.save(error => {
    return error as any;
  });
};

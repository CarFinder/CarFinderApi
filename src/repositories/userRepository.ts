import * as mongoose from 'mongoose';
import { codeErrors } from '../config/config';
import { IUserModel, User } from '../db/';
import { IUser } from '../interfaces/index';
import { SecureError } from '../utils/errors';

export const create = async (user: IUser) => {
  const newcomer = new User(user);
  await newcomer.save(error => {
    return error as any;
  });
};

export const update = async (email: string, payload: any) => {
  const user = await get(email);
  if (!user) {
    throw new SecureError(codeErrors.INCORRECT_EMAIL_OR_PASS);
  }
  await User.update({ email }, payload);
};

export const get = async (email: string): Promise<IUserModel> => {
  return (await User.findOne({ email })) as IUserModel;
};

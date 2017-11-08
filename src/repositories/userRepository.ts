import * as mongoose from 'mongoose';
import { codeErrors } from '../config/config';
import { IUserModel, User } from '../db/';
import { IUser } from '../interfaces/index';
import { DatabaseError, SecureError } from '../utils/errors';

export const create = async (user: IUser) => {
  const newcomer = new User(user);
  await newcomer.save(error => {
    return error as any;
  });
};

export const update = async (email: string, payload: any) => {
  try {
    const user = await User.findOneAndUpdate({ email }, payload);
    if (!user) {
      throw new SecureError(codeErrors.AUTH_ERROR);
    }
  } catch (error) {
    throw new DatabaseError(codeErrors.INTERNAL_DB_ERROR);
  }
};

export const get = async (email: string): Promise<IUserModel> => {
  return (await User.findOne({ email })) as IUserModel;
};

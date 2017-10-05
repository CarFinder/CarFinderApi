import * as mongoose from 'mongoose';

import { IUserModel, User } from '../db/index';

export const get = async (email: string): Promise<IUserModel> => {
  return await User.findOne({ email }, { __v: 0 }) as IUserModel;
}

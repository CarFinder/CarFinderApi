import { IUser } from '../interfaces/index';
import { create } from '../repositories/userRepository';
import { errors } from '../utils/errors';

export const register = async (payload: IUser) => {
  if (!payload) {
    return;
  }
  try {
    await create(payload);
  } catch (error) {
    throw new errors.DatabaseError(error.code);
  }
};

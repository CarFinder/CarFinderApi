import { IUser } from '../interfaces/index';
import { create, update } from '../repositories/userRepository';
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

export const confirm = async (email: string) => {
  if (!email) {
    return;
  }
  try {
    const payload = {
      $set: {
        confirmed: true
      }
    };
    await update(email, payload);
  } catch (error) {
    global.console.log(error);
  }
};

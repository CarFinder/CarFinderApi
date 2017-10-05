import User from '../db/schemas/user';
import { IUser } from '../interfaces/index';
import { registerUser } from '../services/index';

export const signUp = async (payload: IUser) => {
  try {
    await registerUser(payload);
  } catch (error) {
    return error;
  }
};

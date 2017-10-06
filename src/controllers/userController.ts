import { IUser } from '../interfaces/index';
import { registerUser } from '../services/index';

export const signUp = async (payload: IUser) => {
  try {
    await registerUser(payload);
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Account with that email already exist');
    } else {
      throw error;
    }
  }
};

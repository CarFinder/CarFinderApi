import { IUser } from '../interfaces/index';
import { create } from '../repositories/userRepository';

export const register = async (payload: IUser) => {
  try {
    await create(payload);
  } catch (error) {
    throw error;
  }
};

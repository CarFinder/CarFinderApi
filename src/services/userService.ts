import { IUser } from '../interfaces/index';
import { create } from '../repositories/userRepository';

export const register = async (payload: IUser) => {
  try {
    const a = await create(payload);
  } catch (error) {
    return error;
  }
};

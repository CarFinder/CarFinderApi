import { IUser } from '../interfaces/index';
import { create } from '../repositories/userRepository';

export const register = async (payload: IUser) => {
  await create(payload);
};

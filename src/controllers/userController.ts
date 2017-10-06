import { IUser } from '../interfaces/index';
import { registerUser } from '../services/index';

export const signUp = async (payload: IUser) => {
  await registerUser(payload);
};

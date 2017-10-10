import { IUser } from '../interfaces/index';
import { create, get, update } from '../repositories/userRepository';
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
  const payload = {
    $set: {
      confirmed: true
    }
  };
  await update(email, payload);
};

export const getUser = async (email: string): Promise<IUser> => {
  if (!email) {
    return;
  }
  const user = await get(email);
  return {
    confirmed: user.confirmed,
    email: user.email,
    image: user.image,
    interfaceLang: user.interfaceLang,
    name: user.name,
    subscription: user.subscription
  } as any;
};

import { codeErrors } from '../config/config';
import { IUser } from '../interfaces/index';
import { create, get, update } from '../repositories/userRepository';
import { DatabaseError } from '../utils/errors';

export const register = async (payload: IUser) => {
  if (!payload) {
    return;
  }
  try {
    await create(payload);
  } catch (error) {
    throw new DatabaseError(error.code);
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

export const getUserData = async (email: string): Promise<IUser> => {
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
  } as IUser;
};

export const comparePassword = (email: string, password: string, done: any) => {
  get(email)
    .then(user => {
      if (user) {
        user.comparePassword(password, (error: any, isMatch: boolean) => {
          if (error) {
            return done(error);
          }
          if (!isMatch) {
            return done(null, false);
          }

          return done(null, user);
        });
      } else {
        return done(null, false);
      }
    })
    .catch(err => {
      done(err);
    });
};

export const getUser = (email: string, done: any) => {
  get(email)
    .then(user => {
      if (user) {
        done(null, user);
      } else {
        done('Error');
      }
    })
    .catch(err => {
      done(err);
    });
};

import { codeErrors, emailActions } from '../config/config';
import { IUser } from '../interfaces/index';
import { create, get, update } from '../repositories/userRepository';
import { DatabaseError } from '../utils/errors';
import { sendMail } from '../utils/index';

export const register = async (payload: IUser) => {
  try {
    await create(payload);
  } catch (error) {
    throw new DatabaseError(error.code);
  }
};

export const confirm = async (email: string) => {
  const payload = {
    $set: {
      confirmed: true
    }
  };
  await update(email, payload);
};

export const getUserData = async (email: string): Promise<IUser> => {
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

export const comparePassword = async (email: string, password: string, done: any) => {
  const user = await get(email);

  if (user) {
    user.comparePassword(password, (error: any, isMatching: boolean) => {
      if (error) {
        return done(error);
      }
      if (!isMatching) {
        return done(null, false);
      }

      return done(null, user);
    });
  } else {
    return done(null, false);
  }
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

export const sendPasswordEmail = async (email: string) => {
  try {
    const user = await get(email);
    if (user) {
      sendMail(user.email, user.name, emailActions.RESTORE_PASSWORD);
    } else {
      throw new Error('Invalid email');
    }
  } catch (error) {
    throw new DatabaseError(error.code);
  }
};

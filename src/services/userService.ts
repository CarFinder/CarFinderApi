import { codeErrors, emailActions } from '../config/config';
import { IUser, IUserImage } from '../interfaces/index';
import { create, get, update } from '../repositories/userRepository';
import { DatabaseError, RequestError, SecureError } from '../utils/errors';
import { encryptPassword, sendMail, transformDataForMongo, uploadImage } from '../utils/index';

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
    sendMail(user.email, user.name, user.interfaceLang, emailActions.RESTORE_PASSWORD);
  } catch (error) {
    throw new SecureError(codeErrors.INCORRECT_EMAIL_OR_PASS);
  }
};

export const restorePassword = async (password: string, email: string) => {
  try {
    const encryptedPassword = await encryptPassword(password);
    const payload = {
      $set: {
        password: encryptedPassword
      }
    };
    await update(email, payload);
  } catch (error) {
    throw new SecureError(codeErrors.INCORRECT_EMAIL_OR_PASS);
  }
};

export const updateImage = async (email: string, userData: IUserImage) => {
  try {
    const user = await get(email);
    const imageUrl = uploadImage(user.id, userData);
    return imageUrl;
  } catch (error) {
    throw new SecureError(codeErrors.INCORRECT_EMAIL_OR_PASS);
  }
};

export const sendEmailConfirmation = async (email: string, updatedEmail: string) => {
  try {
    const user = await get(email);
    sendMail(updatedEmail, user.name, user.interfaceLang, emailActions.UPDATE_EMAIL);
  } catch (error) {
    throw new SecureError(codeErrors.INCORRECT_EMAIL_OR_PASS);
  }
};

export const updateUserProfile = async (email: string, userData: any) => {
  try {
    const payload: any = transformDataForMongo(userData);
    const updatedData = {
      $set: payload
    };
    await update(email, updatedData);
  } catch (error) {
    throw new DatabaseError(codeErrors.INTERNAL_DB_ERROR);
  }
};

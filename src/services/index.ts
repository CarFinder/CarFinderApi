import { IUser } from '../interfaces/index';
import { decodeToken } from '../utils';
import * as AdService from './adService';
import * as FilterService from './filterService';
import {
  confirm,
  getUserData,
  register,
  restorePassword,
  sendEmailConfirmation,
  sendPasswordEmail,
  updateImage,
  updateUserProfile
} from './userService';

import * as UserService from './userService';

export const registerUser = async (payload: IUser) => {
  await register(payload);
};

export const sendRestorePasswordEmail = async (payload: string) => {
  await sendPasswordEmail(payload);
};

export const restoreUserPassword = async (payload: { password: string; token: string }) => {
  const data = decodeToken(payload.token);
  await restorePassword(payload.password, data.email);
};

export const confirmUserEmail = async (payload: any) => {
  const data = decodeToken(payload.token);
  await confirm(data.email);
  const userData = await getUserData(data.email);
  return userData;
};

export const updateUserData = async (payload: any, token: any) => {
  const data = decodeToken(token);
  if (payload.email) {
    await sendEmailConfirmation(data.email, payload.email);
  }
  await updateUserProfile(data.email, payload);
  const userData = payload.email ? getUserData(payload.email) : getUserData(data.email);
  return userData;
};

export const updateUserSettings = async (payload: any, token: any) => {
  const data = decodeToken(token);
  await updateUserProfile(data.email, payload);
  const userData = getUserData(data.email);
  return userData;
};

export const updateUserImage = async (payload: any, token: any) => {
  const data = decodeToken(token);
  const image = await updateImage(payload.image);
  await updateUserProfile(data.email, image);
  const userData = getUserData(data.email);
  return userData;
};

export const getAds = async (filter?: any, limit?: number, skip?: number, sort?: any) => {
  const adsFromDb = await AdService.getAds(filter, limit, skip, sort);
  const length = adsFromDb.length;

  return Promise.all(
    adsFromDb.map(async ad => {
      const bodyType = await FilterService.getBodyTypeById(ad.bodyTypeId);
      const mark = await FilterService.getMarkById(ad.markId);
      const model = await FilterService.getModelById(ad.modelId);

      return {
        _id: ad._id,
        bodyType: bodyType.name,
        description: ad.description,
        images: ad.images,
        kms: ad.kms,
        mark: mark.name,
        model: model.name,
        price: ad.price,
        sourceName: ad.sourceName,
        sourceUrl: ad.sourceUrl,
        year: ad.year
      };
    })
  );
};

export { AdService, FilterService, UserService };

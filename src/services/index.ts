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

export const updateUserData = async (userData: any, token: any) => {
  const decodedUserData = decodeToken(token);
  if (userData.email !== decodedUserData.email) {
    await sendEmailConfirmation(decodedUserData.email, userData.email);
  }
  await updateUserProfile(decodedUserData.email, userData);
  const payload = userData.email ? getUserData(userData.email) : getUserData(decodedUserData.email);
  return payload;
};

export const updateUserSettings = async (userData: any, token: any) => {
  const decodedUserData = decodeToken(token);
  await updateUserProfile(decodedUserData.email, userData);
  const payload = getUserData(decodedUserData.email);
  return payload;
};

export const updateUserImage = async (userData: any, token: any) => {
  const decodedUserData = decodeToken(token);
  const image = await updateImage(userData);
  await updateUserProfile(decodedUserData.email, image);
  const payload = getUserData(decodedUserData.email);
  return payload;
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

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
  updateUserData
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

export const updateUserProfile = async (payload: any) => {
  const data = decodeToken(payload.token);
  if (payload.email) {
    await sendEmailConfirmation(data.id, payload.email);
  }
  const userData = await updateUserData(data.email, payload);
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

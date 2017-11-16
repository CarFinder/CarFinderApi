import * as _ from 'lodash';
import { codeErrors, limitForSavedFilters } from '../config/config';
import { sourceCodes } from '../config/config';
import { ISavedFilterAds, IUser } from '../interfaces/index';
import { ITransformedMarks } from '../interfaces/parserInterface';
import { Api } from '../parsers';
import { decodeToken } from '../utils';
import { ControllUpdateEmitter } from '../utils/controllEvents';
import { DatabaseError } from '../utils/errors';
import {
  getAvByAds,
  getOnlinerAds,
  transformAdsData,
  transformAvByAds,
  transformOnlinerModelsData
} from '../utils/parserUtils';
import * as AdService from './adService';
import { updateBodyTypes } from './bodyTypeService';
import * as FilterService from './filterService';
import { getAllMarks, updateMarks } from './markService';
import { updateModels } from './modelService';
import { addTempAds, dropCollection, updateAds } from './tempAdService';
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
  const image = await updateImage(decodedUserData.email, userData);
  await updateUserProfile(decodedUserData.email, image);
  const payload = getUserData(decodedUserData.email);
  return payload;
};

export const updateDBData = async (
  marks: ITransformedMarks[],
  models: any,
  bodyTypes: string[]
) => {
  const buffer: string[] = [];
  await updateBodyTypes(bodyTypes);
  await formingTempAdsData(marks, models, bodyTypes);
  await AdService.markSeltAds();
  await AdService.updateAds();
  return;
};

export const formingTempAdsData = async (
  marks: ITransformedMarks[],
  models: any,
  bodyTypes: string[]
) => {
  for (const mark of marks) {
    const markMaket = { name: mark.name };
    const savedMark: any = await updateMarks(markMaket);
    const markId = savedMark.id;
    // if mark name is BMW or Mercedes , don't set models
    // `cause they models setted like series on onliner
    if (mark.name === 'BMW' || mark.name === 'Mercedes') {
      const ads: any = await getOnlinerAds(mark.onlinerMarkId);
      const markAds = await transformAdsData(markId, ads, bodyTypes);
      await addTempAds(markAds);
    } else {
      const listOfModels = models[mark.onlinerMarkId];
      const transformedModels = transformOnlinerModelsData(listOfModels, markId);
      await updateModels(transformedModels);
      const ads: any = await getOnlinerAds(mark.onlinerMarkId);
      const markAds = await transformAdsData(markId, ads, bodyTypes);
      await addTempAds(markAds);
    }
  }
};

export const getAvAdsByModels = async (models: any[]) => {
  let ads: any[] = [];
  for (const model of models) {
    ads = [...ads, ...(await getAvByAds(model))];
  }
  return ads;
};

export const updateDBDateFromAvBy = async (marks: any[], models: any[], bodyTypes: string[]) => {
  await updateBodyTypes(bodyTypes);
  const listOfModels = _.chain(models)
    .map(mark => {
      const markName = Object.keys(mark).shift();
      return { mark: markName, models: mark[markName] };
    })
    .value();
  for (const mark of marks) {
    const savedMark: any = await updateMarks(mark);
    const markId = savedMark.id;
    const markName = savedMark.name;
    const modelsChosedMark = _.find(listOfModels, { mark: markName }).models;
    await updateModels(_.map(modelsChosedMark, (model: any) => ({ name: model.name, markId })));
    const ads = await getAvAdsByModels(modelsChosedMark);
    const transformedAds = await transformAvByAds(ads, markId);
    await AdService.updateAds(transformedAds);
  }
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

export const getSavedFiltersAds = async (user: IUser): Promise<ISavedFilterAds[]> => {
  let result: ISavedFilterAds[] = [];
  try {
    const savedFilters = await FilterService.getSavedSearchFilters(user);
    if (savedFilters.length) {
      result = await Promise.all(
        savedFilters.map(async filter => {
          return {
            ads: await getAds(filter, limitForSavedFilters),
            filterId: filter._id,
            filterName: filter.name,
            filterUrl: filter.url
          };
        })
      );
      return result;
    } else {
      return [];
    }
  } catch (err) {
    throw new DatabaseError(codeErrors.INTERNAL_DB_ERROR);
  }
};

export { AdService, FilterService, UserService };

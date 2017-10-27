import { codeErrors, limitForSavedFilters } from '../config/config';
import { ISavedFilterAds, IUser } from '../interfaces/index';
import { ITransformedMarks } from '../interfaces/parserInterface';
import { get as getUserByEmail } from '../repositories/userRepository';
import { decodeToken } from '../utils';
import { DatabaseError } from '../utils/errors';
import { getOnlinerAds, transformAdsData, transformOnlinerModelsData } from '../utils/parserUtils';
import * as AdService from './adService';
import { updateBodyTypes } from './bodyTypeService';
import * as FilterService from './filterService';
import { getAllMarks, updateMarks } from './markService';
import { updateModels } from './modelService';
import { confirm, getUserData, register, restorePassword, sendPasswordEmail } from './userService';

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

export const updateDBData = async (
  marks: ITransformedMarks[],
  models: any,
  bodyTypes: string[]
) => {
  await updateBodyTypes(bodyTypes);
  for (const mark of marks) {
    const markMaket = { name: mark.name };
    const savedMark: any = await updateMarks(markMaket);
    const markId = savedMark.id;
    // if mark name is BMW or Mercedes , don't set models
    // `cause they models setted like series on onliner
    if (mark.name === 'BMW' || mark.name === 'Mercedes') {
      const ads: any = await getOnlinerAds(mark.onlinerMarkId);
      const markAds = await transformAdsData(markId, ads, bodyTypes);
      await AdService.updateAds(markAds);
    } else {
      const listOfModels = models[mark.onlinerMarkId];
      const transformedModels = transformOnlinerModelsData(listOfModels, markId);
      await updateModels(transformedModels);
      const ads: any = await getOnlinerAds(mark.onlinerMarkId);
      const markAds = await transformAdsData(markId, ads, bodyTypes);
      await AdService.updateAds(markAds);
    }
  }
  return;
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

export const getSavedFiltersAds = async (token: string): Promise<ISavedFilterAds[]> => {
  let result: ISavedFilterAds[] = [];
  try {
    const savedFilters = await FilterService.getSavedSearchFilters(token);
    if (!savedFilters.length) {
      return [];
    } else {
      result = await Promise.all(
        savedFilters.map(async filter => {
          return {
            ads: await getAds(filter, limitForSavedFilters, 0),
            filterId: filter._id,
            filterName: filter.name
          };
        })
      );
      return result;
    }
  } catch {
    throw new DatabaseError(codeErrors.INTERNAL_DB_ERROR);
  }
};

export { AdService, FilterService, UserService };

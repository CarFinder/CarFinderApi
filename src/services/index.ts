import * as async from 'async';
import { codeErrors, limitForSavedFilters,sourceCodes, UNVOLIENT_LIMIT  } from '../config/config';
import { IAdForClient, IMessage, ISavedFilterAds, IUser } from '../interfaces/index';
import { ITransformedMarks } from '../interfaces/parserInterface';
import { Api } from '../parsers';
import { getAllUsersByField } from '../repositories/userRepository';
import { decodeToken } from '../utils';
import { ControllUpdateEmitter } from '../utils/controllEvents';
import { DatabaseError } from '../utils/errors';
import sendMailsWithNewsletter from '../utils/newsletter';
import {
  getAvByAds,
  getOnlinerAds,
  transformAdsData,
  transformAvByAds,
  transformOnlinerModelsData,
  updateAvByData,
  updateOnlinerData
} from '../utils/parserUtils';
import * as AdService from './adService';
import { getAllBodyTypes, getBodyTypeById, updateBodyTypes } from './bodyTypeService';
import * as FilterService from './filterService';
import * as liquidityService from './liquidService';
import { getAllMarks, getMarkById, updateMarks } from './markService';
import { getModelById, getModels, updateModels } from './modelService';
import * as StatsService from './statsService';
import { addTempAds, dropCollection, updateAds } from './tempAdService';
import {
  confirm,
  getUserData,
  register,
  restorePassword,
  sendEmailConfirmation,
  sendMessage,
  sendPasswordEmail,
  updateImage,
  updateUserProfile
} from './userService';

// tslint:disable-next-line:no-var-requires
const _ = require('lodash');

import * as UserService from './userService';

export const getMostLiquidAds = async (): Promise<any> => {
  const topLiquidity = await liquidityService.getTopFive();
  const liquidAdsData = [];
  for (const liquidModel of topLiquidity) {
    // get model mark bodytype and images
    const model = await getModelById(liquidModel.modelId);
    const body = await getBodyTypeById(liquidModel.bodyTypeId);
    const mark = await getMarkById(model.markId);
    const ad = await AdService.getAdByModelId(model.id);
    const url = `/catalog?mark=${model.markId}&model=${liquidModel.modelId}&body=${
      liquidModel.bodyTypeId
    }`;
    const filter = {
      bodyTypeId: liquidModel.bodyTypeId,
      markId: mark.id,
      modelId: liquidModel.modelId
    };

    const liquidAdData = {
      body: body.name,
      image: ad.images[0],
      mark: mark.name,
      median: liquidModel.median,
      model: model.name,
      url
    };
    liquidAdsData.push(liquidAdData);
  }
  return liquidAdsData;
};

export const registerUser = async (payload: IUser) => {
  await register(payload);
};

export const sendRestorePasswordEmail = async (payload: string) => {
  await sendPasswordEmail(payload);
};

export const sendUserMessage = async (data: IMessage) => {
  await sendMessage(data);
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

export const updateDBDataFromOnliner = async (
  marks: ITransformedMarks[],
  models: any,
  bodyTypes: string[]
) => {
  await updateBodyTypes(bodyTypes);
  await formingTempAdsData(marks, models, bodyTypes);
};

export const updateDBData = async () => {
  await updateOnlinerData();
  await updateAvByData();
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
    const listOfModels = models[mark.onlinerMarkId];
    const transformedModels = transformOnlinerModelsData(listOfModels, markId);
    await updateModels(transformedModels, markId);
    const ads: any = await getOnlinerAds(mark.onlinerMarkId);
    const markAds = await transformAdsData(markId, ads, bodyTypes);
    await addTempAds(markAds);
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
    .map((mark: any) => {
      const markName = Object.keys(mark).shift();
      return { mark: markName, models: mark[markName] };
    })
    .value() as any[];
  for (const mark of marks) {
    const savedMark: any = await updateMarks(mark);
    const markId = savedMark.id;
    const markName = savedMark.name;
    const modelsChosedMark = _.find(
      listOfModels,
      (item: any) => item.mark.toLowerCase() === markName.toLowerCase()
    ).models;
    await updateModels(
      _.map(modelsChosedMark, (model: any) => ({ name: model.name, markId })),
      markId
    );
    const ads = await getAvAdsByModels(modelsChosedMark);
    const transformedAds = await transformAvByAds(ads, markId);
    await addTempAds(transformedAds);
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
  const sortParams = 'lastTimeUpDate';
  try {
    const savedFilters = await FilterService.getSavedSearchFilters(user);
    if (savedFilters.length) {
      result = await Promise.all(
        savedFilters.map(async filter => {
          return {
            ads: await getAds(filter, limitForSavedFilters, 0, sortParams),
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


export const calculateAllLiquidity = async () => {
  const bodyTypes = await getAllBodyTypes();
  const models = await getModels();
  const totalSold = await AdService.countSoldAds();

  for (const model of models) {
    for (const bodyType of bodyTypes) {
      const totalSoldInConfig = await AdService.countSoldWithFilter(model.id, bodyType.id);
      const ads = await getAds({modelId: [model.id], bodyTypeId: [bodyType.id]}, UNVOLIENT_LIMIT);
      const adPrices = ads.map((item: any) => item.price);
      _.sortBy(adPrices, [(price: number) => price])
      const medianIndex = Math.round(adPrices.length / 2);
      if (totalSoldInConfig !== 0) {
        const liquidityStatistic = {
          bodyTypeId: bodyType.id,
          liquidityCoefficient: totalSoldInConfig / totalSold,
          median: adPrices[medianIndex],
          modelId: model.id
        };
        await liquidityService.save(liquidityStatistic);
      }
    }
  }
}

export const sendNewsletter = async () => {
  const users: IUser[] = await getAllUsersByField({ subscription: true });
  if (!users.length) {
    return;
  }
  await Promise.all(
    users.map(async (user: IUser) => {
      const savedFilters: ISavedFilterAds[] = await getSavedFiltersAds(user);
      if (!savedFilters.length) {
        return;
      }
      let ads: IAdForClient[] = [];
      ads = ads.concat(...savedFilters.map(savedFilter => savedFilter.ads));
      await sendMailsWithNewsletter(user.name, user.email, ads);
    })
  );
};

export const calculateLiquidity = async (filter: any) => {
  return await AdService.getLiquidity(filter);
};

export { AdService, FilterService, StatsService, UserService };

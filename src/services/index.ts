import { IUser } from '../interfaces/index';
import { ITransformedMarks } from '../interfaces/parserInterface';
import { decodeToken } from '../utils';
import { getAds, transformAdsData, transformOnlinerModelsData } from '../utils/parserUtils';
import { updateAds } from './adService';
import { updateBodyTypes } from './bodyTypeService';
import { getAllMarks, updateMarks } from './markService';
import { updateModels } from './modelService';
import { confirm, getUserData, register } from './userService';
import * as UserService from './userService';

export const registerUser = async (payload: IUser) => {
  await register(payload);
};

export const confirmUserEmail = async (payload: any) => {
  const data = decodeToken(payload.token);
  await confirm(data.email);
  const userData = await getUserData(data.email);
  return userData;
};

export const updateMarksAndModels = async (
  marks: ITransformedMarks[],
  models: any,
  bodyTypes: string[]
) => {
  await updateBodyTypes(bodyTypes);
  for (const mark of marks) {
    const markMaket = { name: mark.name };
    const savedMark: any = await updateMarks(markMaket);
    const markId = savedMark.id;
    if (mark.name === 'BMW' || mark.name === 'Mercedes') {
      const ads: any = await getAds(mark.onlinerMarkId);
      const markAds = await transformAdsData(markId, ads, bodyTypes);
      await updateAds(markAds);
    } else {
      const listOfModels = models[mark.onlinerMarkId];
      const transformedModels = transformOnlinerModelsData(listOfModels, markId);
      await updateModels(transformedModels);
      const ads: any = await getAds(mark.onlinerMarkId);
      const markAds = await transformAdsData(markId, ads, bodyTypes);
      await updateAds(markAds);
    }
  }
  return;
};

export { UserService };

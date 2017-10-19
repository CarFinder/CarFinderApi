import { IUser } from '../interfaces/index';
import { decodeToken, getAds, transformAdsData, transformOnlinerModelsData } from '../utils';
import { updateAds } from './adService';
import { updateBodyTypes } from './bodyTypeService';
import { getAllMarks, updateMarks } from './markService';
import { updateModels } from './modelService';
import { confirm, getUserData, register } from './userService';
import * as UserService from './userService';

// write test(mock data) and isert it in DB

export const registerUser = async (payload: IUser) => {
  await register(payload);
};

export const confirmUserEmail = async (payload: any) => {
  const data = decodeToken(payload.token);
  await confirm(data.email);
  const userData = await getUserData(data.email);
  return userData;
};

export const updateMarksAndModels = async (marks: any, models: any, bodyTypes: any) => {
  await updateBodyTypes(bodyTypes);
  for (const mark of marks) {
    const markModel = { name: mark.name };
    const savedMark: any = await updateMarks(markModel);
    const markId = savedMark.id;
    const listOfModels = models[mark.onlinerMarkId];
    const transformedModels = transformOnlinerModelsData(listOfModels, markId);
    await await updateModels(transformedModels);
    const ads: any = await getAds(mark.onlinerMarkId);
    const markAds = await transformAdsData(markId, ads, bodyTypes);
    await updateAds(markAds);
  }
  return;
};

export { UserService };

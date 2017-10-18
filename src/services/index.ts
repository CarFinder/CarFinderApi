import { IUser } from '../interfaces/index';
import { decodeToken, transformOnlinerModelsData } from '../utils';
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

export const updateMarksAndModels = async (marks: any, models: any) => {
  for (const mark of marks) {
    const markModel = { name: mark.name };
    const savedMark: any = await updateMarks(markModel);
    const markId = savedMark.id;
    const listOfModels = models[mark.onlinerMarkId];
    console.log(mark);
    const transformedModels = transformOnlinerModelsData(listOfModels, markId);
    await updateModels(transformedModels);
  }
  return;
};

export { UserService };

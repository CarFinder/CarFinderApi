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
  await updateMarks(marks);
  const knownMarks = await getAllMarks();
  for (const knownMark of knownMarks) {
    const markId = knownMark.id;
    const listOfModels = models[knownMark.onlinerMarkId];
    const transformedModels = transformOnlinerModelsData(listOfModels, markId);
    await updateModels(transformedModels);
    // console.log('\n', knownMark, '\n', transformedModels, '\n');
  }
  return;
};

export { UserService };

import { IBodyTypeModel } from '../db/';
import { IBodyType } from '../interfaces/';
import { getAll, getByName, save } from '../repositories/bodyTypeRepository';

export const updateBodyTypes = async (bodyTypes: string[]) => {
  const knownBodyTypes = await getAll();
  for (const type of bodyTypes) {
    await addNew(knownBodyTypes, type);
  }
};

const saveBodyType = async (type: string) => {
  await save({ name: type });
};

const addNew = async (knownBodyTypes: IBodyType[], type: string) => {
  let isExist = false;
  for (const knownBodyType of knownBodyTypes) {
    if (knownBodyType.name === type) {
      isExist = true;
    }
  }
  if (!isExist) {
    await saveBodyType(type);
  }
};

export const getBodyTypeByName = async (name: string) => {
  return await getByName(name);
};

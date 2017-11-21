import { IMarkModel } from '../db/schemas/mark';
import { IMark } from '../interfaces/';
import { getAll, getByName, update } from '../repositories/markRepository';

export const getAllMarks = async () => {
  return await getAll();
};

export const updateMarks = async (mark: IMark) => {
  const knownMark: IMarkModel = await getByName(mark.name);
  if (!knownMark) {
    await saveMarks(mark);
    return await getByName(mark.name);
  }
  return knownMark;
};

const saveMarks = async (mark: IMark) => {
  await update(mark);
};

export const getMarkByName = async (name: string) => {
  return await getByName(name);
};

const addNewMark = async (knownMarks: IMark[], mark: IMark) => {
  const isExist = knownMarks.find(knownMark => knownMark.name === mark.name);
  if (!isExist) {
    await saveMarks(mark);
    return;
  }
};

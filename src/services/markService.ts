import { IMarkModel } from '../db/schemas/mark';
import { IMark } from '../interfaces/';
import { getAll, getByName, update } from '../repositories/markRepository';

export const getAllMarks = async () => {
  return await getAll();
};

export const updateMarks = async (mark: IMark) => {
  const knownMarks: IMarkModel[] = await getAllMarks();
  if (knownMarks.length === 0) {
    await saveMarks(mark);
  } else {
    await addNewMark(knownMarks, mark);
  }
  return getByName(mark.name);
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

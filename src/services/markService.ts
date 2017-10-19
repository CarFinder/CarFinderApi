import { IMarkModel } from '../db/schemas/mark';
import { getAll, getByName, update } from '../repositories/markRepository';

export const getAllMarks = async () => {
  return await getAll();
};

export const updateMarks = async (mark: any) => {
  const knownMarks: IMarkModel[] = await getAllMarks();
  if (knownMarks.length === 0) {
    await saveMarks(mark);
  } else {
    await addNewMark(knownMarks, mark);
  }
  return getByName(mark.name);
};

const saveMarks = async (mark: any) => {
  await update(mark);
};

export const getMarkByName = async (name: string) => {
  return await getByName(name);
};

const addNewMark = async (knownMarks: any, mark: any) => {
  let isExist = false;
  for (const knownMark of knownMarks) {
    if (knownMark.name === mark.name) {
      isExist = true;
    }
  }
  if (!isExist) {
    await saveMarks(mark);
  }
};

import { IMarkModel } from '../db/schemas/mark';
import { getAll, getByName, update } from '../repositories/markRepository';

export const getAllMarks = async () => {
  return await getAll();
};

export const updateMarks = async (mark: any) => {
  const knownMarks: IMarkModel[] = await getAllMarks();
  if (knownMarks.length === 0) {
    const newMarks = [];
    newMarks.push(mark);
    await saveMarks(newMarks);
  } else {
    addNewMark(knownMarks, mark);
    await saveMarks(knownMarks);
  }
  return getByName(mark.name);
};

const saveMarks = async (marks: any) => {
  for (const mark of marks) {
    await update(mark);
  }
};

const addNewMark = (knownMarks: any, mark: any) => {
  let isExist = false;
  for (const knownMark of knownMarks) {
    if (knownMark.name === mark.name) {
      isExist = true;
    }
  }
  if (!isExist) {
    knownMarks.push(mark);
  }
  return knownMarks;
};

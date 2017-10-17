import { IMarkModel } from '../db/schemas/mark';
import { getAll, update } from '../repositories/markRepository';

export const getAllMarks = async () => {
  return await getAll();
};

export const updateMarks = async (marks: any) => {
  const knownMarks: IMarkModel[] = await getAllMarks();
  if (knownMarks.length === 0) {
    await saveMarks(marks);
    return;
  } else {
    for (let index = 0; index < knownMarks.length; index++) {
      knownMarks[index] = updateMarkFieds(knownMarks[index], marks);
    }
    addNewmarks(knownMarks, marks);
    await saveMarks(knownMarks);
    return;
  }
};

const saveMarks = async (marks: any) => {
  for (const mark of marks) {
    await update(mark);
  }
};

const addNewmarks = (knownMarks: any, marks: any) => {
  let isExist;
  for (const mark of marks) {
    isExist = false;
    for (const knownMark of knownMarks) {
      if (knownMark.name === mark.name) {
        isExist = true;
      }
    }
    if (!isExist) {
      knownMarks.push(mark);
    }
  }
  return knownMarks;
};

const updateMarkFieds = (currentMark: any, marks: any) => {
  let selectedMark;
  let markIndex;
  for (const mark of marks) {
    if (currentMark.name === mark.name) {
      selectedMark = mark;
      markIndex = marks.indexOf(mark);
    }
  }
  const response = Object.assign(currentMark, selectedMark);
  marks.splice(markIndex, 1);
  return response;
};

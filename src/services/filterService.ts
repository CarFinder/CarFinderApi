import { IBodyTypeModel, IMarkModel, IModelModel } from '../db/';
import { getBodyTypes, getMarks, getModelsByMark } from '../repositories/filterRepository';

export const getAllMarks = async (): Promise<IMarkModel[]> => {
  return await getMarks();
};

export const getAllBodyTypes = async (): Promise<IBodyTypeModel[]> => {
  return await getBodyTypes();
};

export const getAllModelsByMark = async (markId: string): Promise<IModelModel[]> => {
  return await getModelsByMark(markId);
};

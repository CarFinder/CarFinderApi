import { IBodyTypeModel, IMarkModel, IModelModel } from '../db/';
import {
  getBodyType,
  getBodyTypes,
  getMark,
  getMarks,
  getModel,
  getModelsByMark
} from '../repositories/filterRepository';

export const getAllMarks = async (): Promise<IMarkModel[]> => {
  return await getMarks();
};

export const getAllBodyTypes = async (): Promise<IBodyTypeModel[]> => {
  return await getBodyTypes();
};

export const getAllModelsByMark = async (markId: string): Promise<IModelModel[]> => {
  return await getModelsByMark(markId);
};

export const getMarkById = async (id: string): Promise<IMarkModel> => {
  return await getMark(id);
};

export const getBodyTypeById = async (id: string): Promise<IBodyTypeModel> => {
  return await getBodyType(id);
};

export const getModelById = async (id: string): Promise<IModelModel> => {
  return await getModel(id);
};

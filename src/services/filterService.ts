import { codeErrors } from '../config/config';
import { IBodyTypeModel, IFilterModel, IMarkModel, IModelModel } from '../db/';
import { IFilter, IUser } from '../interfaces';
import {
  getBodyType,
  getBodyTypes,
  getMark,
  getMarks,
  getModel,
  getModelsByMark,
  getSavedFiltersByUserId,
  removeAllFilters,
  removeFilterById,
  saveFilter
} from '../repositories/filterRepository';
import { DatabaseError, SecureError } from '../utils/errors';

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

export const getSavedSearchFilters = async (user: IUser): Promise<IFilterModel[]> => {
  try {
    return await getSavedFiltersByUserId(user.id);
  } catch {
    throw new DatabaseError(codeErrors.INTERNAL_DB_ERROR);
  }
};

export const saveSavedSearchFilter = async (
  filterData: IFilter,
  user: IUser
): Promise<IFilterModel> => {
  try {
    filterData.userId = user.id;
    return await saveFilter(filterData);
  } catch {
    throw new DatabaseError(codeErrors.INTERNAL_DB_ERROR);
  }
};

export const removeSavedFilterById = async (id: string) => {
  try {
    return await removeFilterById(id);
  } catch {
    throw new DatabaseError(codeErrors.INTERNAL_DB_ERROR);
  }
};

export const removeAllSavedFilters = async (user: IUser) => {
  try {
    return await removeAllFilters(user.id);
  } catch {
    throw new DatabaseError(codeErrors.INTERNAL_DB_ERROR);
  }
};

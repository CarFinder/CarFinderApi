import { codeErrors } from '../config/config';
import { IBodyTypeModel, IFilterModel, IMarkModel, IModelModel } from '../db/';
import { IFilter } from '../interfaces';
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
import { get as getUserByEmail } from '../repositories/userRepository';
import { decodeToken, transformFilterForSave } from '../utils';
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

export const getSavedSearchFilters = async (token: string): Promise<IFilterModel[]> => {
  const decodedUser = decodeToken(token);
  try {
    const user = await getUserByEmail(decodedUser.email);
    return await getSavedFiltersByUserId(user._id);
  } catch {
    throw new SecureError(codeErrors.AUTH_ERROR);
  }
};

export const saveSavedSearchFilter = async (
  filterData: IFilter,
  token: string
): Promise<IFilterModel> => {
  const decodedUser = decodeToken(token);
  const searchFilter: any = {};
  try {
    const user = await getUserByEmail(decodedUser.email);
    filterData.userId = user._id;
    const transformedFilter = await transformFilterForSave(filterData);
    return await saveFilter(transformedFilter);
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

export const removeAllSavedFilters = async (token: string) => {
  try {
    const decodedUser = decodeToken(token);
    const user = await getUserByEmail(decodedUser.email);
    return await removeAllFilters(user._id);
  } catch {
    throw new DatabaseError(codeErrors.INTERNAL_DB_ERROR);
  }
};

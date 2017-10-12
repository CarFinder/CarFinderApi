import { IAdModel } from '../db/';
import { IFilter } from '../interfaces';
import { getArray } from '../repositories/adRepository';

export const getAds = async (
  filter: IFilter,
  limit?: number,
  skip?: number
): Promise<IAdModel[]> => {
  return await getArray(filter, limit, skip);
};

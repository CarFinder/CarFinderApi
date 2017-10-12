import * as mongoose from 'mongoose';

import { Ad, IAdModel } from '../db/';
import { IFilter } from '../interfaces/';

export const getArray = async (
  filter: IFilter,
  limit?: number,
  skip?: number
): Promise<IAdModel[]> => {
  return (await Ad.find(filter)
    .limit(limit || 0)
    .skip(skip || 0)) as IAdModel[];
};

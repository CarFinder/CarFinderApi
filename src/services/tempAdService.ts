import * as async from 'async';
import { IAdModel } from '../db/';
import { dropCollection, save, updateAds } from '../repositories/tempAdRepository';

export const addTempAds = async (ads: any) => {
  for (const ad of ads) {
    await save(ad);
  }
};

export { dropCollection, updateAds };

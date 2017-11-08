import * as async from 'async';
import { IAdModel } from '../db/';
import { dropCollection, save } from '../repositories/tempAdRepository';

export const addTempAds = async (ads: any) => {
  async.each(ads, async ad => {
    await save(ad);
  });
};

export { dropCollection };

import * as mongoose from 'mongoose';
import { codeErrors } from '../config/config';
import { IAdModel, TempAd } from '../db/';
import { handleDatabaseError } from '../utils';

export const dropCollection = async () => {
  await TempAd.remove({});
};

export const save = async (tempAd: object) => {
  const temp = new TempAd(tempAd);
  await temp.save();
};

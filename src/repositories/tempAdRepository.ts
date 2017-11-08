import * as mongoose from 'mongoose';
import { Transform } from 'stream';
import { codeErrors } from '../config/config';
import { Ad, IAdModel } from '../db/';
import { TempAd } from '../db/';
import { handleDatabaseError } from '../utils';

export const updateAds = async (notSelt: string[]) => {
  const reader = await Ad.find({}).stream();
  const transformer = new Transform({ readableObjectMode: true, writableObjectMode: true });
  transformer._transform = async (chunk: any, encoding: string, next: any) => {
    await Ad.update({ sourceUrl: chunk.sourceUrl }, { $set: chunk });
    notSelt.push(chunk.sourceUrl);
    next();
  };

  return notSelt;
};

export const dropCollection = async () => {
  await TempAd.remove({});
};

export const save = async (tempAd: object) => {
  const temp = new TempAd(tempAd);
  await temp.save();
};

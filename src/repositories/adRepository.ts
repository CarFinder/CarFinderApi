import * as mongoose from 'mongoose';
import * as stream from 'stream';
import { codeErrors } from '../config/config';
import { Ad, IAdModel } from '../db/';
import { handleDatabaseError } from '../utils';
import { ControllUpdateEmitter } from '../utils/controllEvents';
import { SecureError } from '../utils/errors';

// set isSelt flag to true for all ads
// if ad is still exist flag will changed to false
export const preUpdate = async () => {
  const updateStream = await Ad.find({}).stream({ transform: JSON.stringify });
  updateStream.on('data', async chunk => {
    updateStream.pause();
    const data: any = JSON.parse(chunk.toString());
    await Ad.update({ sourceUrl: data.sourceUrl }, { $set: { isSelt: true } });
    updateStream.resume();
  });
  updateStream.on('close', () => ControllUpdateEmitter.emit('finishPrepare'));
};

export const save = async (ad: object) => {
  const newAd = new Ad(ad);
  const error = await newAd.save(err => {
    if (err) {
      handleDatabaseError(err);
    }
  });
};

export const getAll = async () => {
  return await Ad.find();
};

export const update = async (url: string, payload: any) => {
  await Ad.update({ sourceUrl: url }, payload);
};

export const getByFilter = async (
  filter?: any,
  limit?: number,
  skip?: number,
  sort?: any
): Promise<IAdModel[]> => {
  return (await Ad.aggregate([
    {
      $match: filter || {}
    },
    {
      $lookup: {
        as: 'markDocument',
        foreignField: '_id.str',
        from: 'marks',
        localField: 'markId.str'
      }
    },
    {
      $lookup: {
        as: 'modelDocument',
        foreignField: '_id.str',
        from: 'models',
        localField: 'modelId.str'
      }
    },
    {
      $lookup: {
        as: 'bodyDocument',
        foreignField: '_id.str',
        from: 'bodytypes',
        localField: 'bodyTypeId.str'
      }
    },
    { $unwind: '$bodyDocument' },
    { $unwind: '$markDocument' },
    { $unwind: '$modelDocument' },
    {
      $group: {
        _id: '$_id',
        bodyType: { $first: '$bodyDocument.name' },
        description: { $first: '$description' },
        images: { $first: '$images' },
        kms: { $first: '$kms' },
        mark: { $first: '$markDocument.name' },
        model: { $first: '$modelDocument.name' },
        price: { $first: '$price' },
        sourceName: { $first: '$sourceName' },
        sourceUrl: { $first: '$sourceUrl' },
        year: { $first: '$year' }
      }
    }
  ])
    .limit(limit || 20)
    .skip(skip || 0)
    .sort(sort || { year: 1 })) as IAdModel[];
};

export const get = async (
  filter?: any,
  limit?: number,
  skip?: number,
  sort?: any
): Promise<IAdModel[]> => {
  return (await Ad.find(filter || {})
    .limit(limit || 20)
    .skip(skip || 0)
    .sort(sort || { year: 1 })) as IAdModel[];
};

export const getAdByURL = async (url: string) => {
  return await Ad.findOne({ sourceUrl: url });
};

import * as moment from 'moment';
import * as mongoose from 'mongoose';
import { Transform } from 'stream';
import { codeErrors,UNVOLIENT_LIMIT } from '../config/config';
import { Ad, IAdModel, TempAd } from '../db/';
import { handleDatabaseError } from '../utils';
import { ControllUpdateEmitter } from '../utils/controllEvents';
import { SecureError } from '../utils/errors';

export const getSold = async (payload: any) => {
  return await Ad.findOne(payload);
};

export const getByModelId = async (modelId: string) => {
  return await Ad.findOne({ modelId });
};

export const markSeltAds = async () => {
  const response = await TempAd.find({}, { sourceUrl: 1, _id: 0 });
  const existingAds = response.map(item => item.sourceUrl);
  const date = moment().toISOString();
  await Ad.update(
    { sourceUrl: { $nin: existingAds } },
    {
      isSold: true,
      soldDate: date
    },
    { multi: true }
  );
};

export const save = async (ad: object) => {
  const newAd = new Ad(ad);
  const error = await newAd.save(err => {
    if (err) {
      handleDatabaseError(err);
    }
  });
};

export const countSold = async (payload: any) => {
  return await Ad.count(payload);
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
  let limitForQuery:any;
  if(limit === UNVOLIENT_LIMIT ) {
    limitForQuery = UNVOLIENT_LIMIT;
  } else {
    limitForQuery = limit;
  }
  return (await Ad.find(filter || {})
    .limit(limitForQuery || 20)
    .skip(skip || 0)
    .sort(sort || { year: 1 })) as IAdModel[];
};

export const getAdByURL = async (url: string) => {
  return await Ad.findOne({ sourceUrl: url });
};

export const getSoldCarsNumber = async (adFilter: any, time: string) => {
  const soldCars = await Ad.find(adFilter);
  const avgTime = soldCars.length
    ? soldCars
        .map(car => moment(car.soldDate).diff(car.creationDate))
        .reduce((car, nextCar) => car + nextCar) / soldCars.length
    : 0;
  const liquidityData: any = {
    averageTime: moment.duration(avgTime).asDays(),
    result: await Ad.find(adFilter)
      .find({ soldDate: { $gt: time } })
      .count({}),
    total: await Ad.find({ isSold: true, soldDate: { $gt: time } }).count({})
  };
  return liquidityData;
};

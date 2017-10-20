import * as mongoose from 'mongoose';

import { Ad, IAdModel } from '../db/';

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

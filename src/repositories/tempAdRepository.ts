import * as mongoose from 'mongoose';
import { Transform } from 'stream';
import { codeErrors } from '../config/config';
import { Ad, IAdModel } from '../db/';
import { TempAd } from '../db/';
import { handleDatabaseError } from '../utils';

export const updateAds = async () => {
  const reader = await TempAd.find({}).cursor();

  await reader
    .eachAsync(async doc => {
      const ad = await Ad.findOne({ sourceUrl: doc.sourceUrl });
      if (ad) {
        await Ad.update(
          { sourceUrl: doc.sourceUrl },
          {
            $set: {
              bodyTypeId: doc.bodyTypeId,
              description: doc.description,
              images: doc.images,
              isSold: false,
              kns: doc.kms,
              markId: doc.markId,
              modelId: doc.modelId,
              price: doc.price,
              sourceName: doc.sourceName,
              sourceUrl: doc.sourceUrl,
              year: doc.year
            }
          }
        );
      } else {
        const newAd = new Ad({
          bodyTypeId: doc.bodyTypeId,
          description: doc.description,
          images: doc.images,
          isSold: false,
          kns: doc.kms,
          markId: doc.markId,
          modelId: doc.modelId,
          price: doc.price,
          sourceName: doc.sourceName,
          sourceUrl: doc.sourceUrl,
          year: doc.year
        });
        await newAd.save();
      }
    })
    .then(async () => await dropCollection());
};

export const dropCollection = async () => {
  await TempAd.remove({});
};

export const save = async (tempAd: object) => {
  const temp = new TempAd(tempAd);
  await temp.save();
};

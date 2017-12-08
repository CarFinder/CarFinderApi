import * as mongoose from 'mongoose';
import { Transform } from 'stream';
import { codeErrors } from '../config/config';
import { Ad, IAdModel } from '../db/';
import { TempAd } from '../db/';
import { handleDatabaseError } from '../utils';

export const updateAds = async () => {
  const reader = await TempAd.find({}).cursor();

  await reader.eachAsync(async (doc: any) => {
    const ad = await Ad.findOne({ sourceUrl: doc.sourceUrl });
    if (ad) {
      await Ad.update(
        { sourceUrl: doc.sourceUrl },
        {
          $set: {
            bodyTypeId: doc.bodyTypeId,
            creationDate: doc.creationDate,
            description: doc.description,
            images: doc.images,
            isSold: false,
            kms: doc.kms,
            lastTimeUpDate: doc.lastTimeUpDate,
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
        creationDate: doc.creationDate,
        description: doc.description,
        images: doc.images,
        isSold: false,
        kms: doc.kms,
        lastTimeUpDate: doc.lastTimeUpDate,
        markId: doc.markId,
        modelId: doc.modelId,
        price: doc.price,
        sourceName: doc.sourceName,
        sourceUrl: doc.sourceUrl,
        year: doc.year
      });
      await newAd.save();
    }
  });
  await dropCollection();
};

export const dropCollection = async () => {
  await TempAd.remove({});
};

export const save = async (tempAd: any) => {
  try {
    await TempAd.update({ sourceUrl: tempAd.sourceUrl }, { $set: tempAd }, { upsert: true });
  } catch (err) {
    handleDatabaseError(err);
  }
};

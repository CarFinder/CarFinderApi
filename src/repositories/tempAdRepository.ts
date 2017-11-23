import * as mongoose from 'mongoose';
import { Transform } from 'stream';
import { codeErrors } from '../config/config';
import { Ad, IAdModel } from '../db/';
import { TempAd } from '../db/';
import { handleDatabaseError } from '../utils';

export const updateAds = async () => {
  const transformer = new Transform({ readableObjectMode: true, writableObjectMode: true });
  transformer._transform = async (chunk: any, encoding: string, cb: any) => {
    const ad = await Ad.findOne({ sourceUrl: chunk.sourceUrl });
    if (ad) {
      await Ad.update(
        { sourceUrl: chunk.sourceUrl },
        {
          $set: {
            bodyTypeId: chunk.bodyTypeId,
            description: chunk.description,
            images: chunk.images,
            isSold: false,
            kms: chunk.kms,
            markId: chunk.markId,
            modelId: chunk.modelId,
            price: chunk.price,
            sourceName: chunk.sourceName,
            sourceUrl: chunk.sourceUrl,
            year: chunk.year
          }
        }
      );
    } else {
      const newAd = new Ad({
        bodyTypeId: chunk.bodyTypeId,
        description: chunk.description,
        images: chunk.images,
        isSold: false,
        kms: chunk.kms,
        markId: chunk.markId,
        modelId: chunk.modelId,
        price: chunk.price,
        sourceName: chunk.sourceName,
        sourceUrl: chunk.sourceUrl,
        year: chunk.year
      });
      await newAd.save();
    }
    cb();
  };

  const reader = await TempAd.find({})
    .stream()
    .pipe(transformer);

  //  used to fully consume the data from a stream
  reader.resume();

  reader.on('end', async () => {
    await dropCollection();
  });
};

export const dropCollection = async () => {
  await TempAd.remove({});
};

export const save = async (tempAd: object) => {
  const temp = new TempAd(tempAd);
  await temp.save();
};

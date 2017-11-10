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
            isSelt: false,
            kns: chunk.kms,
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
        isSelt: false,
        kns: chunk.kms,
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
  await TempAd.find({})
    .stream()
    .pipe(transformer);
  // cursor.eachAsync(async doc => {
  //   const ad = await Ad.findOne({ sourceUrl: doc.sourceUrl });
  //   if (ad) {
  //     await Ad.update(
  //       { sourceUrl: doc.sourceUrl },
  //       {
  //         $set: {
  //           bodyTypeId: doc.bodyTypeId,
  //           description: doc.description,
  //           images: doc.images,
  //           isSelt: false,
  //           kns: doc.kms,
  //           markId: doc.markId,
  //           modelId: doc.modelId,
  //           price: doc.price,
  //           sourceName: doc.sourceName,
  //           sourceUrl: doc.sourceUrl,
  //           year: doc.year
  //         }
  //       }
  //     );
  //   } else {
  //     const newAd = new Ad({
  //       bodyTypeId: doc.bodyTypeId,
  //       description: doc.description,
  //       images: doc.images,
  //       isSelt: false,
  //       kns: doc.kms,
  //       markId: doc.markId,
  //       modelId: doc.modelId,
  //       price: doc.price,
  //       sourceName: doc.sourceName,
  //       sourceUrl: doc.sourceUrl,
  //       year: doc.year
  //     });
  //     await newAd.save();
  //   }
  // });
  // cursor.on('end', async () => {
  //   console.log(1);
  //   await dropCollection();
  // });
  await dropCollection();
};

export const dropCollection = async () => {
  await TempAd.remove({});
};

export const save = async (tempAd: object) => {
  const temp = new TempAd(tempAd);
  await temp.save();
};

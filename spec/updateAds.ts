import { assert, expect } from 'chai';
import * as sinon from 'sinon';
import { Ad, IAdModel, Mark, Model, TempAd } from '../src/db/';
import * as AdService from '../src/services//adService';
import { addTempAds, dropCollection, updateAds } from '../src/services/tempAdService';
import * as parserUtils from '../src/utils/parserUtils';

describe.only('Ad update', () => {
  const adFields = {
    KMS: 20000,
    MARK_ID: '1',
    MODEL_ID: '2',
    PRICE: 1000,
    SOURCE_NAME: 'onlinerTest',
    SOURCE_URL: 'url',
    YEAR: 2010
  };

  const ads = [
    {
      bodyTypeId: '1',
      description: 'descrip',
      images: ['url'],
      kms: adFields.KMS,
      markId: adFields.MARK_ID,
      modelId: adFields.MODEL_ID,
      price: adFields.PRICE,
      sourceName: adFields.SOURCE_NAME,
      sourceUrl: adFields.SOURCE_URL + 0,
      year: adFields.YEAR
    },
    {
      bodyTypeId: '2',
      description: 'descrip',
      images: ['url'],
      kms: adFields.KMS,
      markId: adFields.MARK_ID,
      modelId: adFields.MODEL_ID,
      price: adFields.PRICE,
      sourceName: adFields.SOURCE_NAME,
      sourceUrl: adFields.SOURCE_URL + 1,
      year: adFields.YEAR
    },
    {
      bodyTypeId: '3',
      description: 'descrip',
      images: ['url'],
      kms: adFields.KMS,
      markId: adFields.MARK_ID,
      modelId: adFields.MODEL_ID,
      price: adFields.PRICE,
      sourceName: adFields.SOURCE_NAME,
      sourceUrl: adFields.SOURCE_URL + 2,
      year: adFields.YEAR
    }
  ];

  const newAds = [
    {
      bodyTypeId: '2',
      description: 'yaaaaahhooo',
      images: ['url'],
      kms: adFields.KMS,
      markId: adFields.MARK_ID,
      modelId: adFields.MODEL_ID,
      price: adFields.PRICE,
      sourceName: adFields.SOURCE_NAME,
      sourceUrl: adFields.SOURCE_URL + 1,
      year: adFields.YEAR
    },
    {
      bodyTypeId: '3',
      description: 'yaaaaahhooo',
      images: ['url'],
      kms: adFields.KMS,
      markId: adFields.MARK_ID,
      modelId: adFields.MODEL_ID,
      price: adFields.PRICE,
      sourceName: adFields.SOURCE_NAME,
      sourceUrl: adFields.SOURCE_URL + 2,
      year: adFields.YEAR
    }
  ];

  describe('temp ads', () => {
    before(async () => {
      await addTempAds(ads);
    });

    it('should insert temp ads', async () => {
      const tmpAds = await TempAd.find({});
      assert.equal(ads.length, tmpAds.length);
    });

    after(async () => {
      await TempAd.remove({});
    });
  });

  describe('should set flag false to selt car', () => {
    before(async () => {
      await addTempAds(ads);
      await updateAds();
      await TempAd.remove({});
    });

    it('should insert temp ads', async () => {
      await addTempAds(newAds);
      await updateAds();
      const tmpAd: IAdModel = await Ad.findOne({ sourceUrl: adFields.SOURCE_URL + 0 });

      assert.equal(false, tmpAd.isSold);
    });

    after(async () => {
      await TempAd.remove({});
      await Ad.remove({});
    });
  });
});

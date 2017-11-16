import { assert, expect } from 'chai';
import { Ad, IAdModel, Mark, Model, TempAd } from '../src/db/';
import { updateDBData } from '../src/services';
import * as AdService from '../src/services//adService';
import { addTempAds, dropCollection, updateAds } from '../src/services/tempAdService';
import * as parserUtils from '../src/utils/parserUtils';

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

describe('Ad update', () => {
  describe('should set flag false to selt car', () => {
    before(async () => {
      await addTempAds(ads);
      await updateAds();
    });

    it('should insert temp ads', async () => {
      await addTempAds(newAds);
      await AdService.markSeltAds();
      const tmpAd: IAdModel = await Ad.findOne({ sourceUrl: adFields.SOURCE_URL + 0 });
      assert.equal(tmpAd.isSold, true);
    });

    after(async () => {
      await TempAd.remove({});
      await Ad.remove({});
    });
  });

  describe('temp ads', () => {
    before(async () => {
      await addTempAds(ads);
    });

    it('should insert temp ads', async () => {
      const tmpAds = await TempAd.find({});
      assert.equal(tmpAds.length, ads.length);
    });

    after(async () => {
      await TempAd.remove({});
    });
  });

  describe('ads updating', () => {
    before(async () => {
      await addTempAds(newAds);
      await updateAds();
    });

    it('should insert ads if ads collection empty', async () => {
      await addTempAds(ads);
      await updateAds();
      const Ads = await Ad.find({});
      assert.equal(Ads.length, ads.length);
    });

    after(async () => {
      await Ad.remove({});
    });
  });
});

import { assert, expect } from 'chai';
<<<<<<< HEAD
import * as sinon from 'sinon';
import { Ad, IAdModel, Mark, Model, TempAd } from '../src/db/';
=======
import { Ad, BodyType, IAdModel, Mark, Model, TempAd } from '../src/db/';
import { updateDBData } from '../src/services';
>>>>>>> dev
import * as AdService from '../src/services//adService';
import { addTempAds, dropCollection, updateAds } from '../src/services/tempAdService';
import * as parserUtils from '../src/utils/parserUtils';

<<<<<<< HEAD
describe('Ad update', () => {
  const adFields = {
    KMS: 20000,
    MARK_ID: '1',
    MODEL_ID: '2',
=======
describe('Ad update', async () => {
  const adFields = {
    BODY_NAME: 'superpcutecoupe',
    KMS: 20000,
    MARK_ID: '4',
    MODEL_ID: '56',
>>>>>>> dev
    PRICE: 1000,
    SOURCE_NAME: 'onlinerTest',
    SOURCE_URL: 'url',
    YEAR: 2010
  };

<<<<<<< HEAD
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
=======
  const bodyObj = {
    name: adFields.BODY_NAME
  };

  const body = await BodyType.create(bodyObj);
  const bodyTypeId = body._id;

  const ads = [
    {
      bodyTypeId,
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
      bodyTypeId,
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
      bodyTypeId,
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
      bodyTypeId,
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
      bodyTypeId,
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

  await BodyType.remove({});

  describe('should set flag false to selt car', () => {
>>>>>>> dev
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

<<<<<<< HEAD
  describe('should set flag false to selt car', () => {
=======
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
>>>>>>> dev
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

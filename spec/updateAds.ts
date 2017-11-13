import * as sinon from 'sinon';
import { Ad, TempAd } from '../src/db/';
import { updateDBData } from '../src/services';
import * as parserUtils from '../src/utils/parserUtils';

const adFields = {
  KMS: 20000,
  MARK_NAME: 'MarkName',
  MODEL_NAME: 'ModelTest',
  PRICE: 1000,
  SOURCE_NAME: 'onlinerTest',
  SOURCE_URL: 'url',
  YEAR: 2010
};

const mark = {
  id: 3,
  name: adFields.MARK_NAME
};

const models = { 3: [{ name: 'abracodabra' }] };

const onlinerStub = sinon.stub(parserUtils, 'getOnlinerAds');
const transformStub = sinon.stub(parserUtils, 'transformAdsData');

const bodyTypes = ['тип1', 'тип2', 'тип3'];

const ads = [
  {
    bodyTypeId: 1,
    description: 'descrip',
    images: ['url'],
    kms: adFields.KMS,
    markId: mark.id,
    modelName: adFields.MODEL_NAME,
    price: adFields.PRICE,
    sourceName: adFields.SOURCE_NAME,
    sourceUrl: adFields.SOURCE_URL + 0,
    year: adFields.YEAR
  },
  {
    bodyTypeId: 2,
    description: 'descrip',
    images: ['url'],
    kms: adFields.KMS,
    markId: mark.id,
    modelName: adFields.MODEL_NAME,
    sourceName: adFields.SOURCE_NAME,
    sourceUrl: adFields.SOURCE_URL + 1,
    year: adFields.YEAR
  },
  {
    bodyTypeId: 3,
    description: 'descrip',
    images: ['url'],
    kms: adFields.KMS,
    markId: mark.id,
    modelName: adFields.MODEL_NAME,
    price: adFields.PRICE,
    sourceName: adFields.SOURCE_NAME,
    sourceUrl: adFields.SOURCE_URL + 2,
    year: adFields.YEAR
  }
];

onlinerStub.returns(ads);
transformStub.returns(ads);

const newAds = [
  {
    bodyTypeId: 2,
    description: 'descrip',
    images: ['url'],
    kms: adFields.KMS,
    markId: mark.id,
    modelName: adFields.MODEL_NAME,
    sourceName: adFields.SOURCE_NAME,
    sourceUrl: adFields.SOURCE_URL + 1,
    year: adFields.YEAR
  },
  {
    bodyTypeId: 3,
    description: 'descrip',
    images: ['url'],
    kms: adFields.KMS,
    markId: mark.id,
    modelName: adFields.MODEL_NAME,
    price: adFields.PRICE,
    sourceName: adFields.SOURCE_NAME,
    sourceUrl: adFields.SOURCE_URL + 2,
    year: adFields.YEAR
  }
];

describe('Ad update', () => {
  after(async () => {
    // drop ad collection
    await Ad.remove({});
  });
  afterEach(async () => {
    // drop tempAd collection
    await TempAd.remove({});
  });

  it('should insert ads', async () => {
    const marks = [mark];
    await updateDBData(marks, models, bodyTypes);
  });
});

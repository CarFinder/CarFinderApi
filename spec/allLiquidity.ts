import { assert, expect } from 'chai';
import { Ad, BodyType, IAdModel, Liquidity, Mark, Model } from '../src/db/';
import { calculateAllLiquidity,getMostLiquidAds } from '../src/services';
import * as AdService from '../src/services//adService';
import * as parserUtils from '../src/utils/parserUtils';

import * as markRepository from '../src/repositories/markRepository';

import * as modelRepository from '../src/repositories/modelRepository';

import { IBodyType, IModel } from '../src/interfaces';
import * as adRepository from '../src/repositories/adRepository';
import * as bodyTypeRepository from '../src/repositories/bodyTypeRepository';
import * as tempAaRepository from '../src/repositories/tempAdRepository';

describe('Calculation liquidity of all cars', () => {
  const adFields = {
    KMS: 20000,
    LAST_TIME_UP_DATE: new Date().getDate(),
    SOURCE_NAME: 'onlinerTest',
    SOURCE_URL: 'url',
    YEAR: 2010
  };

  const isSoldAdStates = [false, true];
  const bodies = ['superpcutecoupe', 'superone'];
  const years = [1999, 2015, 2000];
  const prices = [2000, 2800, 1111];
  const marks = ['audi', 'bibika', 'opel'];
  const models = [['a6', 's8', 'tt'], ['b866', 'rs'], ['535', '555', '740']];

  let bodyTypeIds: IBodyType[];
  let markId: string;

  before(async () => {
    // inserting body types
    for (const bodyType of bodies) {
      await bodyTypeRepository.save({ name: bodyType });
    }
    bodyTypeIds = await bodyTypeRepository.getAll();

    // inserting models and marks
    for (const mark of marks) {
      await markRepository.update({ name: mark });
      const index = marks.indexOf(mark);
      let modelsOfMark: any = models[index];
      const newMark = await markRepository.getByName(mark);
      markId = newMark.id;
      modelsOfMark = modelsOfMark.map((item: any) => ({ markId, name: item }));
      await modelRepository.update(modelsOfMark);
    }

    for (const modelSet of models) {
      const index = models.indexOf(modelSet);
      for (const model of modelSet) {
        const modelObj = await modelRepository.getByName(model);
        const randomIndex = index % 2 === 0 ? 0 : 1;
        const bodyTypeId = bodyTypeIds[randomIndex].id;
        await Ad.create([
          {
            bodyTypeId,
            creationDate: new Date().getDate(),
            description: 'yaaaaahhooo',
            images: ['url'],
            isSold: isSoldAdStates[randomIndex],
            kms: adFields.KMS,
            lastTimeUpDate: adFields.LAST_TIME_UP_DATE,
            markId: modelObj.markId,
            modelId: modelObj.id,
            price: prices[index],
            sourceName: adFields.SOURCE_NAME,
            sourceUrl: adFields.SOURCE_URL + 1 + index,
            year: years[index]
          },
          {
            bodyTypeId,
            creationDate: new Date().getDate(),
            description: 'yaaaaahhooo',
            images: ['url'],
            isSold: isSoldAdStates[randomIndex],
            kms: adFields.KMS,
            lastTimeUpDate: adFields.LAST_TIME_UP_DATE,
            markId: modelObj.markId,
            modelId: modelObj.id,
            price: prices[index],
            sourceName: adFields.SOURCE_NAME,
            sourceUrl: adFields.SOURCE_URL + 2 + index,
            year: years[index]
          }
        ]);
      }
    }
  });

  describe('should calculate liquidity', () => {
    before(async () => {
      await calculateAllLiquidity();
    });

    it('should correct calculate luqidity', async () => {
      const liqu = await Liquidity.find({});
      assert.equal(liqu.length, 2);
      assert.equal(liqu[0].liquidityCoefficient, 0.5);
    });

    it('should get five first most liuid ads', async () => {
      const mostLiquid = await getMostLiquidAds();
      assert.equal(mostLiquid.length, 2);
    });

    after(async () => {
      await Liquidity.remove({});
    });
  });

  after(async () => {
    await BodyType.remove({});
    await Model.remove({});
    await Mark.remove({});
    await Ad.remove({});
  });
});

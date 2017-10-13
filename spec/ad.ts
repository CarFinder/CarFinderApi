import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as HttpStatus from 'http-status-codes';
import * as mongoose from 'mongoose';
import app from './index';

import { Ad, BodyType, Mark, Model } from '../src/db';
import { AdService } from '../src/services';

describe('Ad', () => {
  describe('Filter results', () => {
    before(async () => {
      const bodyObj = {
        name: 'BodyTest'
      };
      const markObj = {
        name: 'MarkTest'
      };
      const body = await BodyType.create(bodyObj);
      const mark = await Mark.create(markObj);
      const modelObj = {
        markId: mark._id,
        name: 'ModelTest'
      };
      const model = await Model.create(modelObj);
      const ads = [
        {
          bodyTypeId: body._id,
          markId: mark._id,
          mileFrom: 20000,
          modelId: model._id,
          price: 1000,
          sourceName: 'onlinerTest',
          sourceUrl: 'url',
          year: 2010
        }
      ];
      await Ad.create(ads);
    });
    after(async () => {
      await Ad.remove({ sourceName: 'onlinerTest' });
      await BodyType.remove({ name: 'BodyTest' });
      await Model.remove({ name: 'ModelTest' });
      await Mark.remove({ name: 'MarkTest' });
    });
    it('do', async () => {
      const mark = await Mark.findOne();
      const ads = await AdService.getAdsByFilter({
        markId: mark._id.toString(),
        maxPrice: 1100,
        minMileFrom: 1000,
        minPrice: 900,
        minYear: 2000
      });
      ads[0].should.have.property('mark').equal('MarkTest');
      ads[0].should.have.property('model').equal('ModelTest');
      ads[0].should.have.property('bodyType').equal('BodyTest');
      ads[0].should.have.property('mileFrom').equal(20000);
      ads[0].should.have.property('price').equal(1000);
      ads[0].should.have.property('year').equal(2010);
    });
  });
});

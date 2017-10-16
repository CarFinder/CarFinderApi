import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as HttpStatus from 'http-status-codes';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as sinon from 'sinon';
import app from './index';

import { codeErrors } from '../src/config/config';
import { Ad, BodyType, Mark, Model } from '../src/db';
import { AdService } from '../src/services';

describe('Ad', () => {
  describe('Filter results', () => {
    let passportStub: any;
    let markId: string;
    let bodyTypeId: string;
    let modelId: string;
    before(async () => {
      passportStub = sinon.stub(passport, 'authenticate').returns(async (ctx: any, next: any) => {
        await next();
      });

      const bodyObj = {
        name: 'BodyTest'
      };
      const markObj = {
        name: 'MarkTest'
      };
      const body = await BodyType.create(bodyObj);
      bodyTypeId = body._id;
      const mark = await Mark.create(markObj);
      const modelObj = {
        markId: mark._id,
        name: 'ModelTest'
      };
      const model = await Model.create(modelObj);
      modelId = model._id;
      const ads = [
        {
          bodyTypeId: body._id,
          markId: mark._id,
          mileFrom: 23000,
          modelId: model._id,
          price: 1000,
          sourceName: 'onlinerTest',
          sourceUrl: 'url',
          year: 2010
        },
        {
          bodyTypeId: body._id,
          markId: mark._id,
          mileFrom: 20000,
          modelId: model._id,
          price: 1000,
          sourceName: 'onlinerTest',
          sourceUrl: 'url',
          year: 2010
        },
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
      markId = mark._id;
      await Ad.create(ads);
    });
    after(async () => {
      passportStub.restore();
      await Ad.remove({ sourceName: 'onlinerTest' });
      await BodyType.remove({ name: 'BodyTest' });
      await Model.remove({ name: 'ModelTest' });
      await Mark.remove({ name: 'MarkTest' });
    });
    describe.only('Services', () => {
      it('should be return array of ads', async () => {
        const mark = await Mark.findOne();
        const ads = await AdService.getAdsByFilter({
          bodyTypeId: bodyTypeId.toString(),
          markId: mark._id.toString(),
          modelId: modelId.toString()
        });
        ads[1].should.have.property('mark').equal('MarkTest');
        ads[1].should.have.property('model').equal('ModelTest');
        ads[1].should.have.property('bodyType').equal('BodyTest');
        ads.should.have.lengthOf(3);
      });

      it('should be works with only min-max mileFrom values', async () => {
        const mark = await Mark.findOne();
        const ads = await AdService.getAdsByFilter({
          markId: mark._id.toString(),
          maxMileFrom: 22000,
          minMileFrom: 1000
        });
        ads[0].should.have.property('mileFrom').equal(20000);
        ads.should.have.lengthOf(2);
      });
      it('should be works with only max mileFrom value', async () => {
        const mark = await Mark.findOne();
        const ads = await AdService.getAdsByFilter({
          markId: mark._id.toString(),
          maxMileFrom: 22000
        });
        ads[0].should.have.property('mileFrom').equal(20000);
      });
      it('should be works with only min mileFrom value', async () => {
        const mark = await Mark.findOne();
        const ads = await AdService.getAdsByFilter({
          markId: mark._id.toString(),
          minMileFrom: 10000
        });
        ads[0].should.have.property('mileFrom').equal(20000);
      });
      it('should be works with only min-max price values', async () => {
        const mark = await Mark.findOne();
        const ads = await AdService.getAdsByFilter({
          markId: mark._id.toString(),
          maxPrice: 1200,
          minPrice: 800
        });
        ads[0].should.have.property('price').equal(1000);
      });
      it('should be works with only max price value', async () => {
        const mark = await Mark.findOne();
        const ads = await AdService.getAdsByFilter({
          markId: mark._id.toString(),
          maxPrice: 1100
        });
        ads[0].should.have.property('price').equal(1000);
      });
      it('should be works with only min price value', async () => {
        const mark = await Mark.findOne();
        const ads = await AdService.getAdsByFilter({
          markId: mark._id.toString(),
          minPrice: 800
        });
        ads[0].should.have.property('price').equal(1000);
      });
      it('should be works with only min-max year values', async () => {
        const mark = await Mark.findOne();
        const ads = await AdService.getAdsByFilter({
          markId: mark._id.toString(),
          maxYear: 2017,
          minYear: 2008
        });
        ads[0].should.have.property('year').equal(2010);
      });
      it('should be works with only max year value', async () => {
        const mark = await Mark.findOne();
        const ads = await AdService.getAdsByFilter({
          markId: mark._id.toString(),
          maxYear: 2017
        });
        ads[0].should.have.property('year').equal(2010);
      });
      it('should be works with only min year value', async () => {
        const mark = await Mark.findOne();
        const ads = await AdService.getAdsByFilter({
          markId: mark._id.toString(),
          minYear: 2008
        });
        ads[0].should.have.property('year').equal(2010);
      });
    });

    describe('requests', () => {
      it('should be return array of ads', async () => {
        const res = await chai
          .request(app)
          .post('/api/ad')
          .set('content-type', 'application/json')
          .send({
            filter: {
              markId,
              minMileFrom: 1000
            },
            limit: 2
          });
        const ads = res.body;
        res.should.have.status(HttpStatus.OK);
        ads.should.have.lengthOf(2);
      });

      it('should be return failed status if do not send required field', async () => {
        try {
          await chai
            .request(app)
            .post('/api/ad')
            .set('content-type', 'application/json')
            .send({});
          chai.assert.fail('Test failed');
        } catch (err) {
          err.response.should.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
          chai.assert.equal(codeErrors.REQUIRED_FIELD, err.response.body.error.code);
        }
      });

      it('should be return failed status if an internal db error occured', async () => {
        const mongoStub = sinon
          .stub(mongoose.Model, 'aggregate')
          .returns((callback: any) => callback('Error'));
        try {
          await chai
            .request(app)
            .post('/api/ad')
            .set('content-type', 'application/json')
            .send({
              filter: {
                markId,
                minMileFrom: 1000
              }
            });
          chai.assert.fail('Test failed');
        } catch (err) {
          err.response.should.have.status(HttpStatus.INTERNAL_SERVER_ERROR);
          chai.assert.equal(codeErrors.INTERNAL_DB_ERROR, err.response.body.error.code);
        }
        mongoStub.restore();
      });
    });
  });
});

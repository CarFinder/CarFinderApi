import * as bluebird from 'bluebird';
import * as chai from 'chai';
import { assert, expect } from 'chai';
import chaiHttp = require('chai-http');
import * as HttpStatus from 'http-status-codes';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as sinon from 'sinon';
import app from './index';

import { codeErrors } from '../src/config/config';
import { Ad, BodyType, Mark, Model } from '../src/db';
import { AdService } from '../src/services';
import { getAds } from '../src/services';

describe('Ad', () => {
  describe('Filter results', () => {
    const adFields = {
      BODY_NAME: 'BodyTest',
      KMS: 20000,
      MARK_NAME: 'MarkName',
      MODEL_NAME: 'ModelTest',
      PRICE: 1000,
      SOURCE_NAME: 'onlinerTest',
      SOURCE_URL: 'url',
      YEAR: 2010
    };
    let passportStub: sinon.SinonStub;
    let markId: string;
    let bodyTypeId: string;
    let modelId: string;
    before(async () => {
      passportStub = sinon.stub(passport, 'authenticate').returns(async (ctx: any, next: any) => {
        await next();
      });

      const bodyObj = {
        name: adFields.BODY_NAME
      };
      const markObj = {
        name: adFields.MARK_NAME
      };
      const body = await BodyType.create(bodyObj);
      bodyTypeId = body.id;
      const mark = await Mark.create(markObj);
      const modelObj = {
        markId: mark.id,
        name: adFields.MODEL_NAME
      };
      const model = await Model.create(modelObj);
      modelId = model.id;

      const ads = [
        {
          bodyTypeId: body.id,
          creationDate: new Date().getDate(),
          kms: adFields.KMS,
          lastTimeUpDate: new Date().getDate(),
          markId: mark.id,
          modelId: model.id,
          price: adFields.PRICE,
          sourceName: adFields.SOURCE_NAME,
          sourceUrl: adFields.SOURCE_URL + 0,
          year: adFields.YEAR
        },
        {
          bodyTypeId: body.id,
          creationDate: new Date().getDate(),
          kms: adFields.KMS,
          lastTimeUpDate: new Date().getDate(),
          markId: mark.id,
          modelId: model.id,
          price: adFields.PRICE,
          sourceName: adFields.SOURCE_NAME,
          sourceUrl: adFields.SOURCE_URL + 1,
          year: adFields.YEAR
        },
        {
          bodyTypeId: body.id,
          creationDate: new Date().getDate(),
          kms: adFields.KMS,
          lastTimeUpDate: new Date().getDate(),
          markId: mark.id,
          modelId: model.id,
          price: adFields.PRICE,
          sourceName: adFields.SOURCE_NAME,
          sourceUrl: adFields.SOURCE_URL + 2,
          year: adFields.YEAR
        }
      ];
      markId = mark.id;
      await Ad.create(ads);
    });
    after(async () => {
      passportStub.restore();
      await Ad.remove({ sourceName: adFields.SOURCE_NAME });
      await BodyType.remove({ name: adFields.BODY_NAME });
      await Model.remove({ name: adFields.MODEL_NAME });
      await Mark.remove({ name: adFields.MARK_NAME });
    });
    describe('Services', () => {
      it('should be return array of ads', async () => {
        const mark = await Mark.findOne();
        const ads = await getAds({
          bodyTypeIds: bodyTypeId.toString(),
          markId: mark._id.toString(),
          modelIds: modelId.toString(),
          sourceName: 'onlinerTest'
        });
        ads[1].should.have.property('mark').equal(adFields.MARK_NAME);
        ads[1].should.have.property('model').equal(adFields.MODEL_NAME);
        ads[1].should.have.property('bodyType').equal(adFields.BODY_NAME);
        ads.should.have.lengthOf(3);
      });

      it('should be working with only min-max mileFrom values', async () => {
        const mark = await Mark.findOne();
        const ads = await getAds({
          kmsFrom: 1000,
          kmsTo: 22000,
          markId: mark._id.toString()
        });
        ads[0].should.have.property('kms').equal(adFields.KMS);
      });
      it('should be works with only max mileFrom value', async () => {
        const mark = await Mark.findOne();
        const ads = await getAds({
          kmsTo: 22000,
          markId: mark._id.toString()
        });
        ads[0].should.have.property('kms').equal(adFields.KMS);
      });
      it('should be works with only min mileFrom value', async () => {
        const mark = await Mark.findOne();
        const ads = await getAds({
          kmsFrom: 10000,
          markId: mark._id.toString()
        });
        ads[0].should.have.property('kms').equal(adFields.KMS);
      });
      it('should be works with only min-max price values', async () => {
        const mark = await Mark.findOne();
        const ads = await getAds({
          markId: mark._id.toString(),
          priceFrom: 800,
          priceTo: 1200
        });
        ads[0].should.have.property('price').equal(adFields.PRICE);
      });
      it('should be works with only max price value', async () => {
        const mark = await Mark.findOne();
        const ads = await getAds({
          markId: mark._id.toString(),
          priceTo: 1100
        });
        ads[0].should.have.property('price').equal(adFields.PRICE);
      });
      it('should be works with only min price value', async () => {
        const mark = await Mark.findOne();
        const ads = await getAds({
          markId: mark._id.toString(),
          priceFrom: 800
        });
        ads[0].should.have.property('price').equal(adFields.PRICE);
      });
      it('should be works with only min-max year values', async () => {
        const mark = await Mark.findOne();
        const ads = await getAds({
          markId: mark._id.toString(),
          yearFrom: 2008,
          yearTo: 2017
        });
        ads[0].should.have.property('year').equal(adFields.YEAR);
      });
      it('should be works with only max year value', async () => {
        const mark = await Mark.findOne();
        const ads = await getAds({
          markId: mark._id.toString(),
          yearTo: 2017
        });
        ads[0].should.have.property('year').equal(adFields.YEAR);
      });
      it('should be works with only min year value', async () => {
        const mark = await Mark.findOne();
        const ads = await getAds({
          markId: mark._id.toString(),
          yearFrom: 2008
        });
        ads[0].should.have.property('year').equal(adFields.YEAR);
      });
    });

    describe('requests', () => {
      it('should be return array of ads', async () => {
        const res = await chai
          .request(app)
          .post('/api/posts')
          .set('content-type', 'application/json')
          .send({
            filter: {
              kmsFrom: 1000,
              markId
            },
            limit: 2
          });
        const ads = res.body;
        res.should.have.status(HttpStatus.OK);
        ads.should.have.lengthOf(2);
      });
      it('should be return failed status if an internal db error occured', async () => {
        const mongoStub = sinon
          .stub(mongoose.Model, 'find')
          .returns((callback: any) => callback('Error'));
        try {
          await chai
            .request(app)
            .post('/api/posts')
            .set('content-type', 'application/json')
            .send({
              filter: {
                kmsFrom: 1000,
                markId
              }
            });
          assert.fail('No error has been thrown while the db was broke');
        } catch (err) {
          err.response.should.have.status(HttpStatus.INTERNAL_SERVER_ERROR);
          assert.equal(codeErrors.INTERNAL_DB_ERROR, err.response.body.error.code);
        }
        mongoStub.restore();
      });
      describe('Validation', () => {
        it('should fail if do not send required field', async () => {
          try {
            await chai
              .request(app)
              .post('/api/posts')
              .set('content-type', 'application/json')
              .send({});
            assert.fail(
              'No error has been thrown by validation while the parameters were incorrect'
            );
          } catch (err) {
            err.response.should.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
            assert.equal(codeErrors.REQUIRED_FIELD, err.response.body.error.code);
          }
        });
        it('should fail if limit field is invalid', async () => {
          try {
            await chai
              .request(app)
              .post('/api/posts')
              .set('content-type', 'application/json')
              .send({
                filter: {
                  markId
                },
                limit: -1
              });
            assert.fail(
              'No error has been thrown by validation while the parameters were incorrect'
            );
          } catch (err) {
            err.response.should.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
            assert.equal(codeErrors.VALIDATION_ERROR, err.response.body.error.code);
          }
        });
        it('should fail if skip field is invalid', async () => {
          try {
            await chai
              .request(app)
              .post('/api/posts')
              .set('content-type', 'application/json')
              .send({
                filter: {
                  markId
                },
                skip: -1
              });
            assert.fail(
              'No error has been thrown by validation while the parameters were incorrect'
            );
          } catch (err) {
            err.response.should.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
            assert.equal(codeErrors.VALIDATION_ERROR, err.response.body.error.code);
          }
        });
        it('should fail if yearFrom field is invalid', async () => {
          try {
            await chai
              .request(app)
              .post('/api/posts')
              .set('content-type', 'application/json')
              .send({
                filter: {
                  markId,
                  yearFrom: 100
                }
              });
            assert.fail(
              'No error has been thrown by validation while the parameters were incorrect'
            );
          } catch (err) {
            err.response.should.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
            assert.equal(codeErrors.VALIDATION_ERROR, err.response.body.error.code);
          }
        });
        it('should fail if yearFrom field is invalid', async () => {
          try {
            await chai
              .request(app)
              .post('/api/posts')
              .set('content-type', 'application/json')
              .send({
                filter: {
                  markId,
                  yearTo: 2020
                }
              });
            assert.fail(
              'No error has been thrown by validation while the parameters were incorrect'
            );
          } catch (err) {
            err.response.should.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
            assert.equal(codeErrors.VALIDATION_ERROR, err.response.body.error.code);
          }
        });
        it('should fail if yearFrom greater than yearTo field is invalid', async () => {
          try {
            await chai
              .request(app)
              .post('/api/posts')
              .set('content-type', 'application/json')
              .send({
                filter: {
                  markId,
                  yearFrom: 2010,
                  yearTo: 2009
                }
              });
            assert.fail(
              'No error has been thrown by validation while the parameters were incorrect'
            );
          } catch (err) {
            err.response.should.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
            assert.equal(codeErrors.VALIDATION_ERROR, err.response.body.error.code);
          }
        });
        it('should fail if priceFrom field is invalid', async () => {
          try {
            await chai
              .request(app)
              .post('/api/posts')
              .set('content-type', 'application/json')
              .send({
                filter: {
                  markId,
                  priceFrom: -2
                }
              });
            assert.fail(
              'No error has been thrown by validation while the parameters were incorrect'
            );
          } catch (err) {
            err.response.should.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
            assert.equal(codeErrors.VALIDATION_ERROR, err.response.body.error.code);
          }
        });
        it('should fail if priceTo field is invalid', async () => {
          try {
            await chai
              .request(app)
              .post('/api/posts')
              .set('content-type', 'application/json')
              .send({
                filter: {
                  markId,
                  priceTo: -2
                }
              });
            assert.fail(
              'No error has been thrown by validation while the parameters were incorrect'
            );
          } catch (err) {
            err.response.should.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
            assert.equal(codeErrors.VALIDATION_ERROR, err.response.body.error.code);
          }
        });
        it('should fail if priceFrom greater than priceTo field is invalid', async () => {
          try {
            await chai
              .request(app)
              .post('/api/posts')
              .set('content-type', 'application/json')
              .send({
                filter: {
                  markId,
                  priceFrom: 2010,
                  priceTo: 2009
                }
              });
            assert.fail(
              'No error has been thrown by validation while the parameters were incorrect'
            );
          } catch (err) {
            err.response.should.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
            assert.equal(codeErrors.VALIDATION_ERROR, err.response.body.error.code);
          }
        });
        it('should fail if kmsFrom field is invalid', async () => {
          try {
            await chai
              .request(app)
              .post('/api/posts')
              .set('content-type', 'application/json')
              .send({
                filter: {
                  kmsFrom: -2,
                  markId
                }
              });
            assert.fail(
              'No error has been thrown by validation while the parameters were incorrect'
            );
          } catch (err) {
            err.response.should.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
            assert.equal(codeErrors.VALIDATION_ERROR, err.response.body.error.code);
          }
        });
        it('should fail if kmsTo field is invalid', async () => {
          try {
            await chai
              .request(app)
              .post('/api/posts')
              .set('content-type', 'application/json')
              .send({
                filter: {
                  kmsTo: -2,
                  markId
                }
              });
            assert.fail(
              'No error has been thrown by validation while the parameters were incorrect'
            );
          } catch (err) {
            err.response.should.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
            assert.equal(codeErrors.VALIDATION_ERROR, err.response.body.error.code);
          }
        });
        it('should fail if kmsFrom greater than kmsTo field is invalid', async () => {
          try {
            await chai
              .request(app)
              .post('/api/posts')
              .set('content-type', 'application/json')
              .send({
                filter: {
                  kmsFrom: 2010,
                  kmsTo: 2009,
                  markId
                }
              });
            assert.fail(
              'No error has been thrown by validation while the parameters were incorrect'
            );
          } catch (err) {
            err.response.should.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
            assert.equal(codeErrors.VALIDATION_ERROR, err.response.body.error.code);
          }
        });
      });
    });
  });
});

import { assert, expect } from 'chai';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as HttpStatus from 'http-status-codes';
import { codeErrors } from '../src/config/config';
import { getStatsFromDatabase } from '../src/services/statsService';
import app from './index';

import { Ad, BodyType, Mark, Model } from '../src/db';

chai.use(chaiHttp);

describe('Send message to carfinder', () => {
  const validMessage = {
    email: 'validemail@test.com',
    message: 'Message',
    name: 'ValidName'
  };

  it("should throw validation error if name or email don't pass validation rules", async () => {
    try {
      await chai
        .request(app)
        .post('/api/user/send-message')
        .set('content-type', 'application/json')
        .send({ email: 'invalid', name: '123' });
      assert.fail('Test failed. No validation error thrown for wrong username and email format');
    } catch (error) {
      error.response.should.have.status(HttpStatus.UNAUTHORIZED);
      assert.equal(codeErrors.VALIDATION_ERROR, error.response.body.error.code);
    }
  });

  it('should be status OK, if email and name pass validation rules', async () => {
    const response = await chai
      .request(app)
      .post('/api/user/send-message')
      .set('content-type', 'application/json')
      .send(validMessage);
    response.should.have.status(HttpStatus.OK);
  });
});

describe('Return number of ads, users and models from DB', () => {
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
  before(async () => {
    const bodyObj = {
      name: adFields.BODY_NAME
    };
    const markObj = {
      name: adFields.MARK_NAME
    };
    const body = await BodyType.create(bodyObj);
    const mark = await Mark.create(markObj);
    const modelObj = {
      markId: mark._id,
      name: adFields.MODEL_NAME
    };
    const model = await Model.create(modelObj);
    const ads = [
      {
        bodyTypeId: body._id,
        kms: adFields.KMS,
        markId: mark._id,
        modelId: model._id,
        price: adFields.PRICE,
        sourceName: adFields.SOURCE_NAME,
        sourceUrl: adFields.SOURCE_URL + 0,
        year: adFields.YEAR
      },
      {
        bodyTypeId: body._id,
        kms: adFields.KMS,
        markId: mark._id,
        modelId: model._id,
        price: adFields.PRICE,
        sourceName: adFields.SOURCE_NAME,
        sourceUrl: adFields.SOURCE_URL + 1,
        year: adFields.YEAR
      },
      {
        bodyTypeId: body._id,
        kms: adFields.KMS,
        markId: mark._id,
        modelId: model._id,
        price: adFields.PRICE,
        sourceName: adFields.SOURCE_NAME,
        sourceUrl: adFields.SOURCE_URL + 2,
        year: adFields.YEAR
      }
    ];
    await Ad.create(ads);
  });
  after(async () => {
    await Ad.remove({ sourceName: adFields.SOURCE_NAME });
    await BodyType.remove({ name: adFields.BODY_NAME });
    await Model.remove({ name: adFields.MODEL_NAME });
    await Mark.remove({ name: adFields.MARK_NAME });
  });
  it('should be status OK', async () => {
    const response = await chai.request(app).get('/api/stats/landing-stats');
    response.should.have.status(HttpStatus.OK);
  });

  it('should return data in the right format', async () => {
    const response = await getStatsFromDatabase();
    expect(response).to.have.all.keys('ads', 'users', 'models');
    expect(response.ads)
      .to.be.a('number')
      .and.to.equal(3);
    expect(response.users)
      .to.be.a('number')
      .and.to.equal(0);
    expect(response.models)
      .to.be.a('number')
      .and.to.equal(1);
  });
});

import { assert, expect } from 'chai';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as HttpStatus from 'http-status-codes';
import * as passport from 'passport';
import * as sinon from 'sinon';
import { codeErrors } from '../src/config/config';
import app from './index';

import { Ad, BodyType, Mark, Model } from '../src/db';

chai.use(chaiHttp);

describe('Calculate liquidity', () => {
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
  const filters: any = {};
  let passportStub: sinon.SinonStub;
  beforeEach(async () => {
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
    const mark = await Mark.create(markObj);
    const modelObj = {
      markId: mark._id,
      name: adFields.MODEL_NAME
    };
    const model = await Model.create(modelObj);
    const date = new Date().getTime() - 1 * 24 * 60 * 60 * 1000;
    const ads = [
      {
        bodyTypeId: body._id,
        isSold: true,
        kms: adFields.KMS,
        markId: mark._id,
        modelId: model._id,
        price: adFields.PRICE,
        soldDate: new Date(date),
        sourceName: adFields.SOURCE_NAME,
        sourceUrl: adFields.SOURCE_URL + 0,
        year: adFields.YEAR
      },
      {
        bodyTypeId: body._id,
        isSold: true,
        kms: adFields.KMS,
        markId: mark._id,
        modelId: model._id,
        price: adFields.PRICE,
        soldDate: new Date(date),
        sourceName: adFields.SOURCE_NAME,
        sourceUrl: adFields.SOURCE_URL + 1,
        year: adFields.YEAR
      },
      {
        bodyTypeId: body._id,
        isSold: true,
        kms: adFields.KMS,
        markId: mark._id,
        modelId: model._id,
        price: adFields.PRICE,
        soldDate: new Date(date),
        sourceName: adFields.SOURCE_NAME,
        sourceUrl: adFields.SOURCE_URL + 2,
        year: adFields.YEAR
      }
    ];
    filters.markId = mark._id;
    filters.bodyTypeId = [body._id];
    filters.modelId = [model._id];
    await Ad.create(ads);
  });
  afterEach(async () => {
    passportStub.restore();
    await Ad.remove({ sourceName: adFields.SOURCE_NAME });
    await BodyType.remove({ name: adFields.BODY_NAME });
    await Model.remove({ name: adFields.MODEL_NAME });
    await Mark.remove({ name: adFields.MARK_NAME });
  });
  it('should be status OK', async () => {
    const response = await chai
      .request(app)
      .post('/api/ad/get-liquidity')
      .set('content-type', 'application/json')
      .send(filters);
    response.should.have.status(HttpStatus.OK);
    response.body.should.equal(3);
  });
});

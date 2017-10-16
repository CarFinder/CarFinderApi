import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as HttpStatus from 'http-status-codes';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as sinon from 'sinon';
import app from './index';

import { codeErrors } from '../src/config/config';
import { BodyType, Mark, Model } from '../src/db';
import { DatabaseError } from '../src/utils/errors';

describe('Filter', () => {
  describe('Get filters data', () => {
    let passportStub: any;
    let markId: string;
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
      const mark = await Mark.create(markObj);
      const modelObj = {
        markId: mark._id,
        name: 'ModelTest'
      };
      const model = await Model.create(modelObj);

      markId = mark._id;
    });
    after(async () => {
      passportStub.restore();
      await BodyType.remove({ name: 'BodyTest' });
      await Model.remove({ name: 'ModelTest' });
      await Mark.remove({ name: 'MarkTest' });
    });
    describe('requests (db works)', () => {
      it('should be return array of marks if success status of responce', async () => {
        const res = await chai.request(app).get('/api/filter/marks');
        const marks = res.body;
        res.should.have.status(HttpStatus.OK);
        marks.should.have.lengthOf(1);
        marks[0].should.have.property('name').equal('MarkTest');
      });
      it('should be return array of bodyTypes if success status of responce', async () => {
        const res = await chai.request(app).get('/api/filter/bodytypes');
        const bodies = res.body;
        res.should.have.status(HttpStatus.OK);
        bodies.should.have.lengthOf(1);
        bodies[0].should.have.property('name').equal('BodyTest');
      });
      it('should be return array of bodyTypes if success status of responce', async () => {
        const res = await chai
          .request(app)
          .post('/api/filter/models')
          .send({ markId });
        const models = res.body;
        res.should.have.status(HttpStatus.OK);
        models.should.have.lengthOf(1);
        models[0].should.have.property('name').equal('ModelTest');
      });
      it('should be return failed status if do not send required field', async () => {
        try {
          const res = await chai
            .request(app)
            .post('/api/filter/models')
            .send({});
          chai.assert.fail('Test failed');
        } catch (err) {
          err.response.should.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
          chai.assert.equal(codeErrors.REQUIRED_FIELD, err.response.body.error.code);
        }
      });
    });
    describe('requests (db do not works)', async () => {
      let mongoStub: any;
      before(async () => {
        mongoStub = sinon.stub(mongoose.Model, 'find').rejects(() => new Error('error'));
      });
      after(async () => {
        mongoStub.restore();
      });
      it('should be return fail status of models req if an internal db error occured', async () => {
        try {
          const res = await chai
            .request(app)
            .post('/api/filter/models')
            .send({ markId });
          chai.assert.fail('Test failed');
        } catch (err) {
          err.response.should.have.status(HttpStatus.INTERNAL_SERVER_ERROR);
          chai.assert.equal(codeErrors.INTERNAL_DB_ERROR, err.response.body.error.code);
        }
      });
      it('should be return fail status of marks req if an internal db error occured', async () => {
        try {
          const res = await chai.request(app).get('/api/filter/marks');
          chai.assert.fail('Test failed');
        } catch (err) {
          err.response.should.have.status(HttpStatus.INTERNAL_SERVER_ERROR);
          chai.assert.equal(codeErrors.INTERNAL_DB_ERROR, err.response.body.error.code);
        }
      });
      it('should be return fail status of bodyT req if an internal db error occured', async () => {
        try {
          const res = await chai.request(app).get('/api/filter/bodytypes');
          chai.assert.fail('Test failed');
        } catch (err) {
          err.response.should.have.status(HttpStatus.INTERNAL_SERVER_ERROR);
          chai.assert.equal(codeErrors.INTERNAL_DB_ERROR, err.response.body.error.code);
        }
      });
    });
  });
});

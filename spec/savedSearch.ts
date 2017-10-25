import assert = require('assert');
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as HttpStatus from 'http-status-codes';
import { codeErrors } from '../src/config/config';
import { Filter, User } from '../src/db';
import { decodeToken, getToken } from '../src/utils';
import { DatabaseError, RequestError, SecureError } from '../src/utils/errors';
import app from './index';

chai.use(chaiHttp);

describe.only('Saved Search', () => {
  const validUser = {
    confirmed: true,
    email: 'validemail@test.com',
    name: 'ValidName',
    password: 'Password1#'
  };
  const validToken = getToken({ email: validUser.email });

  describe('Save new filter', () => {
    const filterFields = {
      bodyTypeId: ['59ef6e585eae9114ddfc7e8b'],
      markId: '59ef6e855eae9114ddfc7fe7',
      modelId: ['59ef6e865eae9114ddfc7ff1'],
      name: 'Unique Test Filter 123454657657567'
    };

    before(async () => {
      await User.create(validUser);
    });

    it('should throw a validation error, if markId or filter name are missing', async () => {
      try {
        await chai
          .request(app)
          .post('/api/filter/saved')
          .set('content-type', 'application/json')
          .set('authorization', `Bearer ${validToken}`)
          .send({
            data: {
              bodyTypeId: ['59ef6e585eae9114ddfc7e8b', '59ef6e585eae9114ddfc7e8c'],
              modelId: ['59ef6e595eae9114ddfc7e98', '59ef6e5a5eae9114ddfc7e9a']
            }
          });
        assert.fail('No error has been thrown while data does not pass validation rules');
      } catch (error) {
        error.response.should.have.status(HttpStatus.BAD_REQUEST);
        assert.equal(codeErrors.VALIDATION_ERROR, error.response.body.error.code);
      }
    });

    it('should throw an auth error, if there is no valid token provided', async () => {
      try {
        await chai
          .request(app)
          .post('/api/filter/saved')
          .set('content-type', 'application/json')
          .set('authorization', `Bearer 59ef6e5a5eae9114ddfc7e9a`)
          .send({
            data: filterFields
          });
        assert.fail('No error has been thrown while token is not valid');
      } catch (error) {
        error.response.should.have.status(HttpStatus.UNAUTHORIZED);
        assert.equal(codeErrors.AUTH_ERROR, error.response.body.error.code);
      }
    });

    it('should return a saved filter, if token and data are valid', async () => {
      await chai
        .request(app)
        .post('/api/filter/saved')
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${validToken}`)
        .send({
          data: filterFields
        });
      const savedFilters = await Filter.find({ name: filterFields.name });
      chai.expect(savedFilters).to.have.lengthOf(1);
      chai.expect(savedFilters[0].name).to.equal(filterFields.name);
      chai.expect(savedFilters[0].markId).to.equal(filterFields.markId);
      chai.expect(savedFilters[0].modelId).to.deep.equal(filterFields.modelId);
      chai.expect(savedFilters[0].bodyTypeId).to.deep.equal(filterFields.bodyTypeId);
    });

    it('should return status OK, if token and data are valid', async () => {
      try {
        const response = await chai
          .request(app)
          .post('/api/filter/saved')
          .set('content-type', 'application/json')
          .set('authorization', `Bearer ${validToken}`)
          .send({
            data: filterFields
          });
        response.should.have.status(HttpStatus.OK);
      } catch {
        assert.fail('No error expected');
      }
    });

    after(async () => {
      await User.remove({ email: validUser.email });
      await Filter.remove({ name: filterFields.name });
    });
  });

  describe('Get saved filters by user id', () => {
    const anotherUser = {
      confirmed: true,
      email: 'anotheremail@test.com',
      name: 'AnotherName',
      password: 'Password2#'
    };
    let userId: string;
    const validTokenOfAnotherUser = getToken({ email: 'anotheremail@test.com' });
    const filters = [
      {
        bodyTypeId: ['59ef6e585eae9114ddfc7e8f'],
        markId: '59ef6fcb5eae9114ddfc8966',
        modelId: [
          '59ef6fd55eae9114ddfc8968',
          '59ef6fd85eae9114ddfc8970',
          '59ef6fe25eae9114ddfc897b'
        ],
        name: 'Unique Test Filter 56557563453212313135790',
        userId: '',
        yearFrom: 2010,
        yearTo: 2017
      }
    ];

    before(async () => {
      const user = await User.create(validUser);
      userId = String(user._id);
      await User.create(anotherUser);
      filters[0].userId = userId;
      await Filter.create(filters);
    });

    it('should return nothing, if user has no saved filters', async () => {
      const response = await chai
        .request(app)
        .get('/api/filter/saved')
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${validTokenOfAnotherUser}`);
      const data = response.body;
      response.should.have.status(HttpStatus.OK);
      data.should.have.lengthOf(0);
    });

    it('should return an array of filters, if a valid token provided', async () => {
      const response = await chai
        .request(app)
        .get('/api/filter/saved')
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${validToken}`);
      const data = response.body;
      response.should.have.status(HttpStatus.OK);
      data.should.have.lengthOf(1);
      data[0].should.have.property('name').equal(filters[0].name);
      data[0].should.have.property('userId').equal(filters[0].userId);
      data[0].should.have.property('markId').equal(filters[0].markId);
      data[0].should.have.property('modelId').deep.equal(filters[0].modelId);
      data[0].should.have.property('bodyTypeId').deep.equal(filters[0].bodyTypeId);
    });

    after(async () => {
      await User.remove({ email: validUser.email });
      await User.remove({ email: anotherUser.email });
      await Filter.remove({ userId });
    });
  });
});

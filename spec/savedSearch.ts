import assert = require('assert');
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as HttpStatus from 'http-status-codes';
import { codeErrors } from '../src/config/config';
import { Ad, BodyType, Filter, Mark, Model, User } from '../src/db';
import { decodeToken, getToken } from '../src/utils';
import { DatabaseError, RequestError, SecureError } from '../src/utils/errors';
import app from './index';

chai.use(chaiHttp);

describe('Saved Search', () => {
  const validUser = {
    confirmed: true,
    email: 'validemail123321@test.com',
    name: 'ValidName',
    password: 'Password1#'
  };
  const validToken = getToken({ email: validUser.email });

  describe('Save new filter', () => {
    const filterFields = {
      bodyTypeId: ['59ef6e585eae9114ddfc7e8b'],
      markId: '59ef6e855eae9114ddfc7fe7',
      modelId: ['59ef6e865eae9114ddfc7ff1'],
      name: 'Unique Test Filter 123454657657567',
      url: 'test-url'
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
      const response = await chai
        .request(app)
        .post('/api/filter/saved')
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${validToken}`)
        .send({
          data: filterFields
        });

      response.should.have.status(HttpStatus.OK);
    });

    after(async () => {
      await User.remove({
        email: {
          $in: [validUser.email]
        }
      });
      await Filter.remove({
        name: {
          $in: [filterFields.name]
        }
      });
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
        url: 'test-url',
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
      data[0].should.have.property('url').equal(filters[0].url);
      data[0].should.have.property('markId').equal(filters[0].markId);
      data[0].should.have.property('modelId').deep.equal(filters[0].modelId);
      data[0].should.have.property('bodyTypeId').deep.equal(filters[0].bodyTypeId);
    });

    after(async () => {
      await User.remove({
        email: {
          $in: [validUser.email, anotherUser.email]
        }
      });
      await Filter.remove({ userId });
    });
  });

  describe('Remove saved filters', () => {
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
        url: 'test-url',
        userId: '',
        yearFrom: 2010,
        yearTo: 2017
      }
    ];
    let userId: string;
    let filterId: string;
    before(async () => {
      const user = await User.create(validUser);
      userId = user._id;
      filters[0].userId = userId;
      const filter = await Filter.create(filters);
      filterId = filter[0]._id;
    });

    it('should throw not found error, if no id is provided in params', async () => {
      try {
        await chai
          .request(app)
          .del('/api/filter/saved')
          .set('content-type', 'application/json')
          .set('authorization', `Bearer ${validToken}`);

        assert.fail('An error expected');
      } catch (error) {
        error.response.should.have.status(HttpStatus.NOT_FOUND);
      }
    });

    it('should remove a saved search filter, is there is a filter with such ID in DB', async () => {
      const response = await chai
        .request(app)
        .del(`/api/filter/saved/${filterId}`)
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${validToken}`);
      const thisFilter = await Filter.findOne({ _id: filterId });

      chai.assert.isNull(thisFilter);
      response.should.have.status(HttpStatus.OK);
    });

    it('should thow a database error, if provided id is not valid', async () => {
      try {
        await chai
          .request(app)
          .del(`/api/filter/saved/${['sadasdasdgg']}`)
          .set('content-type', 'application/json')
          .set('authorization', `Bearer ${validToken}`);

        assert.fail('An error expected');
      } catch (error) {
        error.response.should.have.status(HttpStatus.BAD_REQUEST);
        assert.equal(codeErrors.INTERNAL_DB_ERROR, error.response.body.error.code);
      }
    });

    it('should remove all filters for current user', async () => {
      const response = await chai
        .request(app)
        .del(`/api/filter/saved/all`)
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${validToken}`);
      const filtersForCurrentUser = await Filter.find({ userId });

      chai.assert.lengthOf(filtersForCurrentUser, 0);
      response.should.have.status(HttpStatus.OK);
    });

    after(async () => {
      await User.remove({
        email: {
          $in: [validUser.email]
        }
      });
      await Filter.remove({ userId });
    });
  });

  describe('Return ads for saved search filters', () => {
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
    const anotherUser = {
      confirmed: true,
      email: 'anotheremail321@test.com',
      name: 'AnotherName',
      password: 'Password2#'
    };
    const tokenForAnotherUser = getToken({ email: anotherUser.email });
    const filters: any[] = [];
    let filterId: string;
    let userId: string;
    let markId: string;
    let bodyTypeId: string;
    let modelId: string;
    before(async () => {
      const user = await User.create(validUser);
      await User.create(anotherUser);
      userId = user._id;
      const bodyObj = {
        name: adFields.BODY_NAME
      };
      const markObj = {
        name: adFields.MARK_NAME
      };
      const body = await BodyType.create(bodyObj);
      bodyTypeId = body._id;
      const mark = await Mark.create(markObj);
      const modelObj = {
        markId: mark._id,
        name: adFields.MODEL_NAME
      };
      const model = await Model.create(modelObj);
      modelId = model._id;
      const ads = [
        {
          bodyTypeId: body._id,
          kms: adFields.KMS,
          markId: mark._id,
          modelId: model._id,
          price: adFields.PRICE,
          sourceName: adFields.SOURCE_NAME,
          sourceUrl: `${adFields.SOURCE_URL}123`,
          year: adFields.YEAR
        },
        {
          bodyTypeId: body._id,
          kms: adFields.KMS,
          markId: mark._id,
          modelId: model._id,
          price: adFields.PRICE,
          sourceName: adFields.SOURCE_NAME,
          sourceUrl: `${adFields.SOURCE_URL}321`,
          year: adFields.YEAR
        },
        {
          bodyTypeId: body._id,
          kms: adFields.KMS,
          markId: mark._id,
          modelId: model._id,
          price: adFields.PRICE,
          sourceName: adFields.SOURCE_NAME,
          sourceUrl: `${adFields.SOURCE_URL}666`,
          year: adFields.YEAR
        }
      ];
      markId = mark._id;
      await Ad.create(ads);
      filters[0] = {
        bodyTypeId: [bodyTypeId],
        markId,
        modelId: [modelId],
        name: 'Unique Test Filter 8978565432',
        url: 'test-url',
        userId,
        yearFrom: adFields.YEAR
      };
      const filter = await Filter.create(filters);
      filterId = String(filter[0]._id);
    });

    it('should return an empty array, if there is no saved filters for such user', async () => {
      const response = await chai
        .request(app)
        .get('/api/posts/saved/')
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${tokenForAnotherUser}`);
      const data = response.body;

      response.should.have.status(HttpStatus.OK);
      data.should.have.lengthOf(0);
    });

    it('should return only two ads if user has any saved seach filters', async () => {
      const response = await chai
        .request(app)
        .get('/api/posts/saved/')
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${validToken}`);
      const data = response.body;

      response.should.have.status(HttpStatus.OK);
      data.should.have.lengthOf(1);
      data[0].should.have.property('filterName').equal(filters[0].name);
      data[0].should.have.property('filterUrl').equal(filters[0].url);
      data[0].should.have.property('filterId').equal(filterId);
      data[0].should.have.property('ads').lengthOf(2);
      data[0].ads[0].bodyType.should.equal(adFields.BODY_NAME);
      data[0].ads[0].mark.should.equal(adFields.MARK_NAME);
      data[0].ads[0].model.should.equal(adFields.MODEL_NAME);
      data[0].ads[0].year.should.equal(adFields.YEAR);
    });

    after(async () => {
      await User.remove({
        email: {
          $in: [validUser.email, anotherUser.email]
        }
      });
      await Filter.remove({ userId });
      await Ad.remove({
        sourceName: {
          $in: [adFields.SOURCE_NAME]
        }
      });
      await BodyType.remove({
        name: {
          $in: [adFields.BODY_NAME]
        }
      });
      await Model.remove({
        name: {
          $in: [adFields.MODEL_NAME]
        }
      });
      await Mark.remove({
        name: {
          $in: [adFields.MARK_NAME]
        }
      });
    });
  });
});

import * as chai from 'chai';
import { assert, expect } from 'chai';
import chaiHttp = require('chai-http');
import * as HttpStatus from 'http-status-codes';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as sinon from 'sinon';
import { User } from '../src/db';
import { sendEmailConfirmation, updateImage, updateUserProfile } from '../src/services/userService';
import { decodeToken, getToken, transformDataForMongo, transformDataForToken } from '../src/utils';
import app from './index';

import { codeErrors } from '../src/config/config';

chai.use(chaiHttp);

describe('User Profile', () => {
  const user = {
    confirmed: true,
    email: 'abracodabra@test.com',
    image: 'linktoimage.com',
    interfaceLanguage: 'ru',
    name: 'UserName',
    password: 'pass123***',
    subscription: false
  };
  const token = getToken(transformDataForToken({ email: user.email }));
  let passportStub: sinon.SinonStub;

  describe('Update user data', () => {
    before(async () => {
      passportStub = sinon.stub(passport, 'authenticate').returns(async (ctx: any, next: any) => {
        await next();
      });
      await User.create(user);
    });

    after(async () => {
      passportStub.restore();
      await User.remove({ email: user.email });
    });

    it("should throw a validation error if email or name don't pass validation rules", async () => {
      try {
        await chai
          .request(app)
          .post('/api/user/update-user-data')
          .set('content-type', 'application/json')
          .set('authorization', `Bearer ${token}`)
          .send({
            email: '123email123.@com',
            name: '***123***'
          });
        assert.fail('Test failed. No validation error thrown for wrong username and email format');
      } catch (error) {
        error.response.should.have.status(HttpStatus.UNAUTHORIZED);
        assert.equal(codeErrors.VALIDATION_ERROR, error.response.body.error.code);
      }
    });

    it('should return updated token if new email and name are valid', async () => {
      const response = await chai
        .request(app)
        .post('/api/user/update-user-data')
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${token}`)
        .send({
          email: 'email@test.com',
          name: 'UserName'
        });

      const updatedUser = decodeToken(response.body.token);
      updatedUser.should.have.property('email').equal('email@test.com');
      updatedUser.should.have.property('name').equal('UserName');
      updatedUser.should.have.property('interfaceLanguage').equal(user.interfaceLanguage);
      response.should.have.status(HttpStatus.OK);
    });
  });

  describe('Update user settings', () => {
    before(async () => {
      passportStub = sinon.stub(passport, 'authenticate').returns(async (ctx: any, next: any) => {
        await next();
      });
      await User.create(user);
    });

    after(async () => {
      passportStub.restore();
      await User.remove({ email: user.email });
    });

    it('should return updated token with new user settings', async () => {
      const response = await chai
        .request(app)
        .post('/api/user/update-user-settings')
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${token}`)
        .send({
          interfaceLanguage: 'en',
          subscription: true
        });
      const updatedUser = decodeToken(response.body.token);
      updatedUser.should.have.property('email').equal(user.email);
      updatedUser.should.have.property('interfaceLanguage').equal('en');
      updatedUser.should.have.property('subscription').equal(true);
      response.should.have.status(HttpStatus.OK);
    });

    it('should throw error if user does not exist', async () => {
      const newEmail = 'email@test.com';
      const userEmail = 'invalid@test.com';
      try {
        await sendEmailConfirmation(userEmail, newEmail);
        assert.fail('No error has been thrown even though such user does not exist');
      } catch (error) {
        assert.equal(codeErrors.INCORRECT_EMAIL_OR_PASS, error.data.code);
      }
    });
  });

  describe('Update user image', () => {
    const imageData = {
      image: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      type: 'image/gif'
    };

    before(async () => {
      passportStub = sinon.stub(passport, 'authenticate').returns(async (ctx: any, next: any) => {
        await next();
      });
      await User.create(user);
    });

    after(async () => {
      passportStub.restore();
      await User.remove({ email: user.email });
    });

    it('should return updated token with new user image', async () => {
      const response = await chai
        .request(app)
        .post('/api/user/update-user-image')
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${token}`)
        .send(imageData);
      const updatedUser = decodeToken(response.body.token);
      updatedUser.should.have.property('email').equal(user.email);
      updatedUser.should.have.property('image').equal(updatedUser.image);
      response.should.have.status(HttpStatus.OK);
    });

    it('should return an object with valid url', async () => {
      const email = 'email@test.com';
      const res = await updateImage(email, imageData);
      expect(res).to.have.all.keys('image', 'type');
      expect(res.image).to.match(/s3(.*?)amazonaws/i);
    });

    it('should throw error if user does not exist', async () => {
      const userEmail = 'invalid@test.com';
      try {
        const res = await updateImage(userEmail, imageData);
        assert.fail('No error has been thrown even though such user does not exist');
      } catch (error) {
        assert.equal(codeErrors.INCORRECT_EMAIL_OR_PASS, error.data.code);
      }
    });
  });

  describe('Update any of the data', () => {
    const imageData = {
      image: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      type: 'image/gif'
    };

    before(async () => {
      passportStub = sinon.stub(passport, 'authenticate').returns(async (ctx: any, next: any) => {
        await next();
      });
      await User.create(user);
    });

    after(async () => {
      passportStub.restore();
      await User.remove({ email: user.email });
    });

    it('should throw error if email is invalid', async () => {
      const userEmail = 'invalid@test.com';
      try {
        const res = await updateUserProfile(userEmail, imageData);
        assert.fail('No error has been thrown even though such user does not exist');
      } catch (error) {
        assert.equal(codeErrors.INTERNAL_DB_ERROR, error.data.code);
      }
    });

    it('should return object without undefined fields', async () => {
      const userData = { name: 'UserName' };
      const res = transformDataForMongo(userData);
      expect(res).to.have.key('name');
      expect(res).to.not.have.keys('email', 'interfaceLanguage', 'subscription', 'image');
    });
  });
});

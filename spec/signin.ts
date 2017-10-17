import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as HttpStatus from 'http-status-codes';
import app from './index';

import { User } from '../src/db';

import { getToken } from '../src/utils/';

describe('SignIn', () => {
  describe('JWT', () => {
    it('should be able to generate jwt', () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InB1cGtpbkBtYWlsLmNvbSJ9.Si2nol4q-7SeMzCkyvm94s45CzP7kx3jG4y9OLdGcv4';
      chai.assert.equal(token, getToken({ email: 'pupkin@mail.com' }));
    });
  });
  describe('API', () => {
    after(async () => {
      await User.remove({ email: { $in: ['email@email.com', 'email1@email.com'] } });
    });

    before(async () => {
      const user = {
        email: 'email@email.com',
        name: 'Name',
        password: 'Password1@'
      };
      const confirmedUser = {
        confirmed: true,
        email: 'email1@email.com',
        name: 'Name',
        password: 'Password1@'
      };

      await User.create([confirmedUser, user]);
    });

    it('should be receive failed status if user does not exist', async () => {
      try {
        await chai
          .request(app)
          .post('/api/user/signin')
          .set('content-type', 'application/json')
          .send({
            email: 'test@email.com',
            password: 'Password1@'
          });
        chai.assert.fail('Fail');
      } catch (err) {
        err.response.should.have.status(HttpStatus.UNAUTHORIZED);
        err.response.body.should.have.property('error');
        chai.assert.equal(101, err.response.body.error.code);
      }
    });
    it('should be receive failed status if user does not activated', async () => {
      try {
        await chai
          .request(app)
          .post('/api/user/signin')
          .set('content-type', 'application/json')
          .send({
            email: 'email@email.com',
            password: 'Password1@'
          });
        chai.assert.fail('Fail');
      } catch (err) {
        err.response.should.have.status(HttpStatus.UNAUTHORIZED);
        err.response.body.should.have.property('error');
        chai.assert.equal(103, err.response.body.error.code);
      }
    });
    it('should be receive failed status if incorrect password', async () => {
      try {
        await chai
          .request(app)
          .post('/api/user/signin')
          .set('content-type', 'application/json')
          .send({
            email: 'email@email.com',
            password: 'Password12@'
          });
        chai.assert.fail('Fail');
      } catch (err) {
        err.response.should.have.status(HttpStatus.UNAUTHORIZED);
        err.response.body.should.have.property('error');
        chai.assert.equal(err.response.body.error.code, 101);
      }
    });
    it('should be receive succes status if signin is succesed', async () => {
      const res = await chai
        .request(app)
        .post('/api/user/signin')
        .set('content-type', 'application/json')
        .send({
          email: 'email1@email.com',
          password: 'Password1@'
        });
      res.body.should.have.property('token');
      res.should.have.status(HttpStatus.OK);
    });
    it('should be receive failed status if user sent invalid data', async () => {
      try {
        await chai
          .request(app)
          .post('/api/user/signin')
          .set('content-type', 'application/json')
          .send({
            email: 'email1email.com',
            password: 'password'
          });
        chai.assert.fail('Fail');
      } catch (err) {
        err.response.should.have.status(HttpStatus.UNAUTHORIZED);
        err.response.body.should.have.property('error');
        chai.assert.equal(err.response.body.error.code, 105);
      }
    });
  });
});

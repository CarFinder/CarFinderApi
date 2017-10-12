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
    after(done => {
      User.remove({ email: { $in: ['email@email.com', 'email1@email.com'] } }).then(() => done());
    });

    before(done => {
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

      User.create([confirmedUser, user], () => done());
    });

    it('should be receive failed status if user does not exist', done => {
      chai
        .request(app)
        .post('/api/user/signin')
        .set('content-type', 'application/json')
        .send({
          email: 'test@email.com',
          password: 'Password1@'
        })
        .end((err, res) => {
          res.should.have.status(HttpStatus.UNAUTHORIZED);
          res.body.should.have.property('error');
          chai.assert.equal(101, res.body.error.code);
          done();
        });
    });
    it('should be receive failed status if user does not activated', done => {
      chai
        .request(app)
        .post('/api/user/signin')
        .set('content-type', 'application/json')
        .send({
          email: 'email@email.com',
          password: 'Password1@'
        })
        .end((err, res) => {
          res.should.have.status(HttpStatus.UNAUTHORIZED);
          res.body.should.have.property('error');
          chai.assert.equal(103, res.body.error.code);
          done();
        });
    });
    it('should be receive failed status if incorrect password', done => {
      chai
        .request(app)
        .post('/api/user/signin')
        .set('content-type', 'application/json')
        .send({
          email: 'email@email.com',
          password: 'Password12@'
        })
        .end((err, res) => {
          res.should.have.status(HttpStatus.UNAUTHORIZED);
          res.body.should.have.property('error');
          chai.assert.equal(res.body.error.code, 101);
          done();
        });
    });
    it('should be receive succes status if signin is succesed', done => {
      chai
        .request(app)
        .post('/api/user/signin')
        .set('content-type', 'application/json')
        .send({
          email: 'email1@email.com',
          password: 'Password1@'
        })
        .end((err, res) => {
          res.body.should.have.property('token');
          res.should.have.status(HttpStatus.OK);
          done();
        });
    });
    it('should be receive failed status if user sent invalid data', done => {
      chai
        .request(app)
        .post('/api/user/signin')
        .set('content-type', 'application/json')
        .send({
          email: 'email1email.com',
          password: 'password'
        })
        .end((err, res) => {
          res.should.have.status(HttpStatus.UNAUTHORIZED);
          res.body.should.have.property('error');
          chai.assert.equal(res.body.error.code, 105);
          done();
        });
    });
  });
});

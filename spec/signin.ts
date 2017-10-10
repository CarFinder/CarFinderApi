import * as chai from 'chai';
import chaiHttp = require('chai-http');
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
      User.remove({ email: 'email@email.com' }).then(() => done());
    });

    before(done => {
      const user = new User({
        email: 'email@email.com',
        name: 'Name',
        password: 'password'
      });

      user.save(() => done());
    });

    it('should be receive failed status if user does not exist', done => {
      chai
        .request(app)
        .post('/api/user/signin')
        .set('content-type', 'application/json')
        .send({
          email: 'test@email.com',
          password: 'password'
        })
        .end((err, res) => {
          chai.assert.equal(101, res.body.error.code);
          res.should.have.status(401);
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
          password: 'password'
        })
        .end((err, res) => {
          chai.assert.equal(103, res.body.error.code);
          res.should.have.status(401);
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
          password: 'password1'
        })
        .end((err, res) => {
          chai.assert.equal(101, res.body.error.code);
          res.should.have.status(401);
          done();
        });
    });
    // it('should be receive succes status if login is succesed', done => {
    //   User.findOneAndUpdate(
    //     { email: 'email@email.com' },
    //     { $set: { confirmed: true } }
    //   ).then(() => {
    //     chai
    //       .request(app)
    //       .post('/api/user/signin')
    //       .set('content-type', 'application/json')
    //       .send({
    //         email: 'email@email.com',
    //         password: 'password'
    //       })
    //       .end((err, res) => {
    //         res.should.have.status(200);
    //         done();
    //       });
    //   });
    // });
  });
});

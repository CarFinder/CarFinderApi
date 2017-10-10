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
    // afterEach(done => {
    //   User.remove({ email: 'email@email.com' }).then(() => done());
    // });

    it('should be receive failed status if user does not exist', done => {
      chai
        .request(app)
        .post('/api/user/signin')
        .set('content-type', 'application/json')
        .send({
          email: 'email@email.com',
          password: 'password'
        })
        .end((err, res) => {
          chai.assert.equal(101, res.body.error.code);
          res.should.have.status(401);
          done();
        });
    });
    // it('should be receive failed status if user does not activated', async () => {
    //   const user = new User({
    //     email: 'email@email.com',
    //     name: 'Name',
    //     password: 'password'
    //   });

    //   await user.save(err => {
    //     return err;
    //   });

    //   chai
    //     .request(app)
    //     .post('/api/user/signin')
    //     .set('content-type', 'application/json')
    //     .send({
    //       email: 'email@email.com',
    //       password: 'password'
    //     })
    //     .end((err, res) => {
    //       chai.assert.equal(103, res.body.error.code);
    //       res.should.have.status(401);
    //     });
    // });
  });
});

import assert = require('assert');
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as HttpStatus from 'http-status-codes';
import { codeErrors } from '../src/config/config';
import { User } from '../src/db';
import { decodeToken, getToken } from '../src/utils';
import app from './index';

chai.use(chaiHttp);

describe('Restore Password', () => {
  const validUser = {
    confirmed: true,
    email: 'validemail@test.com',
    name: 'ValidName',
    password: 'Password1#'
  };
  const validToken = getToken({ email: validUser.email });

  before(done => {
    User.create(validUser).then(() => done());
  });

  it("should throw a validation error, if a password doesn't pass validation rules", done => {
    chai
      .request(app)
      .post('/api/user/restore')
      .set('content-type', 'application/json')
      .send({
        data: {
          password: 'invalidpassword',
          token: validToken
        }
      })
      .end((err, res) => {
        res.should.have.status(HttpStatus.UNAUTHORIZED);
        assert.equal(codeErrors.VALIDATION_ERROR, res.body.error.code);
        done();
      });
  });

  it('should throw an auth error, if no token is provided', done => {
    chai
      .request(app)
      .post('/api/user/restore')
      .set('content-type', 'application/json')
      .send({ data: { password: 'Password2#' } })
      .end((err, res) => {
        res.should.have.status(HttpStatus.UNAUTHORIZED);
        assert.equal(codeErrors.AUTH_ERROR, res.body.error.code);
        done();
      });
  });

  it('should throw a JWT Decode error, if token is not valid', done => {
    chai
      .request(app)
      .post('/api/user/restore')
      .set('content-type', 'application/json')
      .send({
        data: {
          password: 'Password2#',
          token: 'ey123'
        }
      })
      .end((err, res) => {
        res.should.have.status(HttpStatus.UNAUTHORIZED);
        assert.equal(codeErrors.JWT_DECODE_ERROR, res.body.error.code);
        done();
      });
  });

  it("should throw an error, if can'not update password with such email", done => {
    chai
      .request(app)
      .post('/api/user/restore')
      .set('content-type', 'application/json')
      .send({
        data: {
          password: 'Password2#',
          token: getToken({ email: 'invalidemail@test.com' })
        }
      })
      .end((err, res) => {
        res.should.have.status(HttpStatus.UNAUTHORIZED);
        assert.equal(codeErrors.INCORRECT_EMAIL_OR_PASS, res.body.error.code);
        done();
      });
  });

  it('should be status OK, if token and new password are valid', done => {
    chai
      .request(app)
      .post('/api/user/restore')
      .set('content-type', 'application/json')
      .send({
        data: {
          password: 'Password2#',
          token: validToken
        }
      })
      .end((err, res) => {
        res.should.have.status(HttpStatus.OK);
        done();
      });
  });

  after(done => {
    User.remove({ email: validUser.email }).then(() => done());
  });
});

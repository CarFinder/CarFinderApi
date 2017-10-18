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

  before(async () => {
    await User.create(validUser);
  });

  it("should throw a validation error, if a password doesn't pass validation rules", async () => {
    try {
      await chai
        .request(app)
        .post('/api/user/restore')
        .set('content-type', 'application/json')
        .send({
          data: {
            password: 'invalidpassword',
            token: validToken
          }
        });
      assert.fail('Test failed');
    } catch (error) {
      error.response.should.have.status(HttpStatus.UNAUTHORIZED);
      assert.equal(codeErrors.VALIDATION_ERROR, error.response.body.error.code);
    }
  });

  it('should throw an auth error, if no token is provided', async () => {
    try {
      await chai
        .request(app)
        .post('/api/user/restore')
        .set('content-type', 'application/json')
        .send({ data: { password: 'Password2#' } });
      assert.fail('Test failed');
    } catch (error) {
      error.response.should.have.status(HttpStatus.UNAUTHORIZED);
      assert.equal(codeErrors.AUTH_ERROR, error.response.body.error.code);
    }
  });

  it('should throw a JWT Decode error, if token is not valid', async () => {
    try {
      await chai
        .request(app)
        .post('/api/user/restore')
        .set('content-type', 'application/json')
        .send({
          data: {
            password: 'Password2#',
            token: 'ey123'
          }
        });
      assert.fail('Test failed');
    } catch (error) {
      error.response.should.have.status(HttpStatus.UNAUTHORIZED);
      assert.equal(codeErrors.JWT_DECODE_ERROR, error.response.body.error.code);
    }
  });

  it("should throw an error, if can'not update password with such email", async () => {
    try {
      await chai
        .request(app)
        .post('/api/user/restore')
        .set('content-type', 'application/json')
        .send({
          data: {
            password: 'Password2#',
            token: getToken({ email: 'invalidemail@test.com' })
          }
        });
      assert.fail('Test failed');
    } catch (error) {
      error.response.should.have.status(HttpStatus.UNAUTHORIZED);
      assert.equal(codeErrors.INCORRECT_EMAIL_OR_PASS, error.response.body.error.code);
    }
  });

  it('should be status OK, if token and new password are valid', async () => {
    try {
      const response = await chai
        .request(app)
        .post('/api/user/restore')
        .set('content-type', 'application/json')
        .send({
          data: {
            password: 'Password2#',
            token: validToken
          }
        });
      response.should.have.status(HttpStatus.OK);
    } catch (error) {
      assert.fail('Test failed');
    }
  });

  after(async () => {
    await User.remove({ email: validUser.email });
  });
});

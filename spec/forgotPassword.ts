import assert = require('assert');
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as HttpStatus from 'http-status-codes';
import { codeErrors } from '../src/config/config';
import { User } from '../src/db';
import app from './index';

chai.use(chaiHttp);

describe('Forgot password', () => {
  before(async () => {
    const validUser = {
      confirmed: true,
      email: 'validemail@test.com',
      name: 'ValidName',
      password: 'Password1#'
    };
    await User.create(validUser);
  });

  it('should throw a security error, if there is no email in the database', async () => {
    try {
      await chai
        .request(app)
        .post('/api/user/forgot')
        .set('content-type', 'application/json')
        .send({ email: 'nosuchemail@test.com' });
      assert.fail('Test failed');
    } catch (error) {
      error.response.should.have.status(HttpStatus.UNAUTHORIZED);
      assert.equal(codeErrors.INCORRECT_EMAIL_OR_PASS, error.response.body.error.code);
    }
  });

  it("should throw a validation error, if an email doesn't pass validation rules", async () => {
    try {
      await chai
        .request(app)
        .post('/api/user/forgot')
        .set('content-type', 'application/json')
        .send({ email: 'invalid' });
      assert.fail('Test failed');
    } catch (error) {
      error.response.should.have.status(HttpStatus.UNAUTHORIZED);
      assert.equal(codeErrors.VALIDATION_ERROR, error.response.body.error.code);
    }
  });

  it('should be status OK, if an email passes validation rules and exists in the DB', async () => {
    try {
      const response = await chai
        .request(app)
        .post('/api/user/forgot')
        .set('content-type', 'application/json')
        .send({ email: 'validemail@test.com' });
      response.should.have.status(HttpStatus.OK);
    } catch {
      assert.fail('Test failed');
    }
  });

  after(async () => {
    await User.remove({ email: 'validemail@test.com' });
  });
});

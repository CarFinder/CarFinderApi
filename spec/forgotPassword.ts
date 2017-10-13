import assert = require('assert');
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as HttpStatus from 'http-status-codes';
import { codeErrors } from '../src/config/config';
import { User } from '../src/db';
import app from './index';

chai.use(chaiHttp);

describe('Forgot password', () => {
  before(done => {
    const validUser = {
      confirmed: true,
      email: 'validemail@test.com',
      name: 'ValidName',
      password: 'Password1#'
    };
    User.create(validUser).then(() => done());
  });

  it('should throw a security error, if there is no email in the database', done => {
    chai
      .request(app)
      .post('/api/user/forgot')
      .set('content-type', 'application/json')
      .send({ email: 'nosuchemail@test.com' })
      .end((err, res) => {
        res.should.have.status(HttpStatus.UNAUTHORIZED);
        assert.equal(codeErrors.INCORRECT_EMAIL_OR_PASS, res.body.error.code);
        done();
      });
  });

  it("should throw a validation error, if an email doesn't pass validation rules", done => {
    chai
      .request(app)
      .post('/api/user/forgot')
      .set('content-type', 'application/json')
      .send({ email: 'invalidemail' })
      .end((err, res) => {
        res.should.have.status(HttpStatus.UNAUTHORIZED);
        assert.equal(codeErrors.VALIDATION_ERROR, res.body.error.code);
        done();
      });
  });

  it('should be status OK, if an email passes validation rules and exists in the DB', done => {
    chai
      .request(app)
      .post('/api/user/forgot')
      .set('content-type', 'application/json')
      .send({ email: 'validemail@test.com' })
      .end((err, res) => {
        res.should.have.status(HttpStatus.OK);
        done();
      });
  });

  after(done => {
    User.remove({ email: 'validemail@test.com' }).then(() => done());
  });
});

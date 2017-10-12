import assert = require('assert');
import chai = require('chai');
import chaiHttp = require('chai-http');
import * as HttpStatus from 'http-status-codes';
import { codeErrors } from '../src/config/config';
import { User } from '../src/db/index';
import { IUser } from '../src/interfaces';
import { confirm } from '../src/services/userService';
import { decodeToken, getToken } from '../src/utils';
import app from './index';

const should = chai.should();
chai.use(chaiHttp);

describe('Confirm user logic', () => {
  const user = {
    email: 'test@mail.com',
    interfaceLang: 'en',
    name: 'Ivan',
    password: 'Password1@'
  };

  beforeEach(async () => {
    const newcomer = new User(user);
    await newcomer.save(err => {
      return err;
    });
  });

  it('should set confirmed field to "true"', async () => {
    await confirm(user.email);
    await User.findOne({ email: user.email }, (err, res) => {
      assert.equal(true, res.confirmed);
    });
  });

  it('sould be succes if user exist', done => {
    const authToken = getToken({ email: 'test@mail.com' });
    const token = getToken({
      confirmed: true,
      email: 'test@mail.com',
      image: '',
      interfaceLang: 'en',
      name: 'Ivan',
      subscription: true
    });
    chai
      .request(app)
      .post('/api/user/confirm')
      .set('content-type', 'application/json')
      .send({
        token: authToken
      })
      .end((err, res) => {
        res.should.have.status(HttpStatus.OK);
        assert.equal(token, res.body.token);
        done();
      });
  });

  afterEach(async () => {
    await User.remove({ email: 'test@mail.com' });
  });
});

describe('Token generation and decoding', () => {
  it('should create and decode token', () => {
    const token = getToken({ email: 'pupkin@mail.com' });
    const decoded = decodeToken(token);
    assert.equal('pupkin@mail.com', decoded.email);
  });
});

describe('Token generation and decoding', () => {
  before(async () => {
    const user = {
      email: 'pupkin@mail.com',
      interfaceLang: 'en',
      name: 'Ivan',
      password: 'Real Man'
    };
    const newcomer = new User(user);
    await newcomer.save(err => {
      return err;
    });
  });

  it('shoult trow error if token invalid', done => {
    const token = getToken({ email: `abcd` });
    chai
      .request(app)
      .post('/api/user/confirm')
      .set('content-type', 'application/json')
      .send({
        token
      })
      .end((err, res) => {
        res.should.have.status(HttpStatus.UNAUTHORIZED);
        done();
      });
  });

  it('shoult return custom error if token invalid', done => {
    chai
      .request(app)
      .post('/api/user/confirm')
      .set('content-type', 'application/json')
      .send({
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InB1cktpbkBtYWlsLmNvbSJ9.Si2nol4q-7SeMzCkyvm44s45CzP7kx3jG4y9OLdGcv4'
      })
      .end((err, res) => {
        assert.equal(codeErrors.JWT_DECODE_ERROR, res.body.error.code);
        assert.equal('Secure error', res.body.error.type);
        done();
      });
  });

  after(async () => {
    await User.remove({ email: 'pupkin@mail.com' });
  });
});

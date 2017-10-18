import assert = require('assert');
import chai = require('chai');
import chaiHttp = require('chai-http');
import * as HttpStatus from 'http-status-codes';
import { promisify } from 'util';
import { User } from '../src/db/';
import { IUser } from '../src/interfaces';
import { confirm } from '../src/services/userService';
import { decodeToken, getToken } from '../src/utils';
import { DatabaseError } from '../src/utils/errors';
import app from './index';

const should = chai.should();
chai.use(chaiHttp);

describe('User Registartion', () => {
  afterEach(done => {
    User.remove({ email: 'pupkin@mail.com' }).then(done());
  });

  it('should be succes if users email is not used yet', done => {
    chai
      .request(app)
      .post('/api/user/register')
      .set('content-type', 'application/json')
      .send({
        email: 'pupkin@mail.com',
        interfaceLang: 'en',
        name: 'Ivan',
        password: 'Password1@'
      })
      .end((err, res) => {
        res.should.have.status(HttpStatus.CREATED);
        done();
      });
  });

  it('should be failt if user with this email is exist', done => {
    const test = () =>
      chai
        .request(app)
        .post('/api/user/register')
        .set('content-type', 'application/json')
        .send({
          email: 'pupkin@mail.com',
          interfaceLang: 'en',
          name: 'Ivan',
          password: 'Password1@'
        })
        .end((err, res) => {
          res.should.have.status(HttpStatus.CONFLICT);
          done();
        });

    chai
      .request(app)
      .post('/api/user/register')
      .set('content-type', 'application/json')
      .send({
        email: 'pupkin@mail.com',
        interfaceLang: 'en',
        name: 'Ivan',
        password: 'Password1@'
      })
      .end((err, res) => {
        test();
      });
  });

  it('should return custom error if email in use', done => {
    const error = new DatabaseError(11000);
    const test = () =>
      chai
        .request(app)
        .post('/api/user/register')
        .set('content-type', 'application/json')
        .send({
          email: 'pupkin@mail.com',
          interfaceLang: 'en',
          name: 'Ivan',
          password: 'Password1@'
        })
        .end((err, res) => {
          assert.equal(error.data.code, res.body.error.code);
          done();
        });

    chai
      .request(app)
      .post('/api/user/register')
      .set('content-type', 'application/json')
      .send({
        email: 'pupkin@mail.com',
        interfaceLang: 'en',
        name: 'Ivan',
        password: 'Password1@'
      })
      .end((err, res) => {
        test();
      });
  });
  it('should be receive failed status if user sent invalid data', done => {
    chai
      .request(app)
      .post('/api/user/register')
      .set('content-type', 'application/json')
      .send({
        email: 'email1email.com',
        name: '...',
        password: 'password'
      })
      .end((err, res) => {
        res.should.have.status(HttpStatus.CONFLICT);
        res.body.should.have.property('error');
        assert.equal(res.body.error.code, 105);
        done();
      });
  });
});

describe('Sign up logic', () => {
  it('should insert correct user data', async () => {
    const user = {
      email: 'pupkin@mail.com',
      interfaceLang: 'en',
      name: 'Ivan',
      password: 'Password1@'
    };

    const newUser = new User(user);

    await newUser.save(err => {
      return err;
    });

    await User.findOne({ email: user.email }, (err, res) => {
      assert.equal(user.email, res.email);
      assert.equal(user.interfaceLang, res.interfaceLang);
      assert.equal(user.name, res.name);
      assert.equal(true, res.subscription);
    });

    await User.remove({ email: 'pupkin@mail.com' });
  });
});

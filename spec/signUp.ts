import assert = require('assert');
import chai = require('chai');
import chaiHttp = require('chai-http');
import { promisify } from 'util';
import { User } from '../src/db/index';
import { IUser } from '../src/interfaces';
import { confirm } from '../src/services/userService';
import { decodeToken, getToken } from '../src/utils';
import { errors } from '../src/utils/errors';
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
      .post('/user/register')
      .set('content-type', 'application/json')
      .send({
        email: 'pupkin@mail.com',
        interfaceLang: 'en',
        name: 'Ivan',
        password: 'Real Man'
      })
      .end((err, res) => {
        res.should.have.status(201);
        assert.equal('OK', res.text);
        done();
      });
  });

  it('should be failt if user with this email is exist', done => {
    const test = () =>
      chai
        .request(app)
        .post('/user/register')
        .set('content-type', 'application/json')
        .send({
          email: 'pupkin@mail.com',
          interfaceLang: 'en',
          name: 'Ivan',
          password: 'Real Man'
        })
        .end((err, res) => {
          res.should.have.status(409);
          done();
        });

    chai
      .request(app)
      .post('/user/register')
      .set('content-type', 'application/json')
      .send({
        email: 'pupkin@mail.com',
        interfaceLang: 'en',
        name: 'Ivan',
        password: 'Real Man'
      })
      .end((err, res) => {
        test();
      });
  });

  it('should return custom error if email in use', done => {
    const error = new errors.DatabaseError(11000);
    const test = () =>
      chai
        .request(app)
        .post('/user/register')
        .set('content-type', 'application/json')
        .send({
          email: 'pupkin@mail.com',
          interfaceLang: 'en',
          name: 'Ivan',
          password: 'Real Man'
        })
        .end((err, res) => {
          assert.equal(error.data.code, res.body.error.code);
          assert.equal(error.data.enMessage, res.body.error.enMessage);
          assert.equal(error.data.ruMessage, res.body.error.ruMessage);
          assert.equal(error.data.type, res.body.error.type);
          done();
        });

    chai
      .request(app)
      .post('/user/register')
      .set('content-type', 'application/json')
      .send({
        email: 'pupkin@mail.com',
        interfaceLang: 'en',
        name: 'Ivan',
        password: 'Real Man'
      })
      .end((err, res) => {
        test();
      });
  });
});

describe('Sign up logic', () => {
  it('should insert correct user data', async () => {
    let user = {
      email: 'pupkin@mail.com',
      interfaceLang: 'en',
      name: 'Ivan',
      password: 'Real Man'
    };

    let newUser = new User(user);

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

    user = {
      email: 'test@mail.com',
      interfaceLang: 'en',
      name: 'Ivan',
      password: 'Real Man'
    };

    newUser = new User(user);

    await newUser.save(err => {
      return err;
    });

    await User.findOne({ email: user.email }, (err, res) => {
      assert.equal(user.email, res.email);
      assert.equal(user.interfaceLang, res.interfaceLang);
      assert.equal(user.name, res.name);
      assert.equal(true, res.subscription);
    });

    await User.remove({ email: 'test@mail.com' });
  });
});

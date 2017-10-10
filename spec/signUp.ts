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
        confirmed: false,
        email: 'pupkin@mail.com',
        image: 'lint to s3',
        interfaceLang: 'en',
        name: 'Ivan',
        password: 'Real Man',
        subscription: false
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
          confirmed: false,
          email: 'pupkin@mail.com',
          image: 'lint to s3',
          interfaceLang: 'en',
          name: 'Ivan',
          password: 'Real Man',
          subscription: false
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
        confirmed: false,
        email: 'pupkin@mail.com',
        image: 'lint to s3',
        interfaceLang: 'en',
        name: 'Ivan',
        password: 'Real Man',
        subscription: false
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
          confirmed: false,
          email: 'pupkin@mail.com',
          image: 'lint to s3',
          interfaceLang: 'en',
          name: 'Ivan',
          password: 'Real Man',
          subscription: false
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
        confirmed: false,
        email: 'pupkin@mail.com',
        image: 'lint to s3',
        interfaceLang: 'en',
        name: 'Ivan',
        password: 'Real Man',
        subscription: false
      })
      .end((err, res) => {
        test();
      });
  });
});

describe('Sign up logic', () => {
  it('should insert correct user data', async () => {
    let user = {
      confirmed: false,
      email: 'pupkin@mail.com',
      image: 'lint to s3',
      interfaceLang: 'en',
      name: 'Ivan',
      password: 'Real Man',
      subscription: false
    };

    let newUser = new User(user);

    await newUser.save(err => {
      return err;
    });

    let testedUser: IUser;
    await User.findOne({ email: user.email }, (err, res) => {
      testedUser = res;
    });

    assert.equal(user.email, testedUser.email);
    assert.equal(user.interfaceLang, testedUser.interfaceLang);
    assert.equal(user.name, testedUser.name);
    assert.equal(user.subscription, testedUser.subscription);
    await User.remove({ email: 'pupkin@mail.com' });

    user = {
      confirmed: false,
      email: 'test@mail.com',
      image: 'lint to s3',
      interfaceLang: 'ru',
      name: 'Test',
      password: '1',
      subscription: false
    };

    newUser = new User(user);

    await newUser.save(err => {
      return err;
    });

    await User.findOne({ email: user.email }, (err, res) => {
      testedUser = res;
    });

    assert.equal(user.email, testedUser.email);
    assert.equal(user.interfaceLang, testedUser.interfaceLang);
    assert.equal(user.name, testedUser.name);
    assert.equal(user.subscription, testedUser.subscription);
    await User.remove({ email: 'test@mail.com' });
  });
});

describe('Confirm user logic', () => {
  it('should set confirmed field to "true"', async () => {
    const user = {
      confirmed: false,
      email: 'pupkin@mail.com',
      image: 'lint to s3',
      interfaceLang: 'en',
      name: 'Ivan',
      password: 'Real Man',
      subscription: false
    };

    const newcomer = new User(user);

    await newcomer.save(err => {
      return err;
    });

    await confirm(user.email);

    await User.findOne({ email: user.email }, (err, res) => {
      assert.equal(true, res.confirmed);
    });

    await User.remove({ email: 'pupkin@mail.com' });
  });
});

describe('Confirm user logic', () => {
  it('shoul create correct token', () => {
    const token = getToken({ email: 'pupkin@mail.com' });
    assert.equal(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InB1cGtpbkBtYWlsLmNvbSJ9.Si2nol4q-7SeMzCkyvm94s45CzP7kx3jG4y9OLdGcv4',
      token
    );
  });

  it('should decode token', () => {
    const decoded = decodeToken(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InB1cGtpbkBtYWlsLmNvbSJ9.Si2nol4q-7SeMzCkyvm94s45CzP7kx3jG4y9OLdGcv4'
    );
    assert.equal('pupkin@mail.com', decoded.email);
  });
});

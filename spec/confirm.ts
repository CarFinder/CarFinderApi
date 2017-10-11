import assert = require('assert');
import chai = require('chai');
import chaiHttp = require('chai-http');
import { User } from '../src/db/index';
import { IUser } from '../src/interfaces';
import { confirm } from '../src/services/userService';
import { decodeToken, getToken } from '../src/utils';
import app from './index';

const should = chai.should();
chai.use(chaiHttp);

describe('Confirm user logic', () => {
  const user = {
    email: 'pupkin@mail.com',
    interfaceLang: 'en',
    name: 'Ivan',
    password: 'Real Man'
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
    chai
      .request(app)
      .post('/api/user/confirm')
      .set('content-type', 'application/json')
      .send({
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InB1cGtpbkBtYWlsLmNvbSJ9.Si2nol4q-7SeMzCkyvm94s45CzP7kx3jG4y9OLdGcv4'
      })
      .end((err, res) => {
        res.should.have.status(200);
        assert.equal(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb25maXJtZWQiOnRydWUsImVtYWlsIjoicHVwa2luQG1haWwuY29tIiwiaW1hZ2UiOiIiLCJpbnRlcmZhY2VMYW5nIjoiZW4iLCJuYW1lIjoiSXZhbiIsInN1YnNjcmlwdGlvbiI6dHJ1ZX0.gpgESzsa4rQJdHp4RvQ76U-ezVaFTVhyxjpSG8GqiOA',
          res.body.token
        );
        done();
      });
  });

  afterEach(async () => {
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

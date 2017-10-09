// tslint:disable:no-unused-expression

import * as chai from 'chai';

import { User, Ad, BodyType, Filter, Mark, Model } from '../src/db';

describe('Database Models', () => {
  describe('User Model', () => {
    it('should be invalid if required fields are empty', done => {
      const user = new User();

      user.validate(err => {
        chai.expect(err.errors.email).to.exist;
        chai.expect(err.errors.name).to.exist;
        chai.expect(err.errors.password).to.exist;
        done();
      });
    });

    it('should valid if required fields are not empty', done => {
      const user = new User({
        email: 'email',
        name: 'name',
        password: 'password'
      });

      user.validate(err => {
        chai.expect(err).to.not.exist;
        done();
      });
    });
  });
});

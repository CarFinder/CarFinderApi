import * as chai from 'chai';

import { User } from '../src/db';

describe('Database Models', () => {
  describe('User Model', () => {
    it('should be invalid if required fields are empty', done => {
      const user = new User();

      user.validate(err => {
        // tslint:disable:no-unused-expression
        chai.expect(err.errors.email).to.exist;
        chai.expect(err.errors.name).to.exist;
        chai.expect(err.errors.interfaceLang).to.exist;
        chai.expect(err.errors.password).to.exist;
        chai.expect(err.errors.subscription).to.exist;
        done();
      });
    });
  });
});

// tslint:disable:no-unused-expression

import * as chai from 'chai';

import { Ad, BodyType, Filter, Mark, Model, User } from '../src/db';

describe('Database Models', () => {
  describe('Ad Madel', () => {
    it('should be invalid if required fields are empty', done => {
      const ad = new Ad();

      ad.validate(err => {
        chai.expect(err.errors.bodyTypeId).to.exist;
        chai.expect(err.errors.markId).to.exist;
        chai.expect(err.errors.modelId).to.exist;
        chai.expect(err.errors.sourceName).to.exist;
        chai.expect(err.errors.sourceUrl).to.exist;
        chai.expect(err.errors.year).to.exist;
        done();
      });
    });

    it('should be valid if required fields are not empty', done => {
      const ad = new Ad({
        bodyTypeId: 'bodyTypeId',
        markId: 'markId',
        modelId: 'modelId',
        sourceName: 'sourceName',
        sourceUrl: 'sourceUrl',
        year: 2017
      });

      ad.validate(err => {
        chai.expect(err).to.not.exist;
        done();
      });
    });
  });

  describe('BodyType model', () => {
    it('should be invalid if required fields are empty', done => {
      const bodyType = new BodyType();

      bodyType.validate(err => {
        chai.expect(err.errors.name).to.exist;
        done();
      });
    });

    it('should be valid if required fields are not empty', done => {
      const bodyType = new BodyType({
        name: 'name'
      });

      bodyType.validate(err => {
        chai.expect(err).to.not.exist;
        done();
      });
    });
  });

  describe('Filter model', () => {
    it('should be invalid if required fields are empty', done => {
      const filter = new Filter();

      filter.validate(err => {
        chai.expect(err.errors.markId).to.exist;
        chai.expect(err.errors.userId).to.exist;
        chai.expect(err.errors.name).to.exist;
        done();
      });
    });

    it('should be valid if required fields are not empty', done => {
      const filter = new Filter({
        markId: 'markId',
        name: 'name',
        userId: 'userId'
      });

      filter.validate(err => {
        chai.expect(err).to.not.exist;
        done();
      });
    });
  });

  describe('Mark model', () => {
    it('should be invalid if required fields are empty', done => {
      const mark = new Mark();

      mark.validate(err => {
        chai.expect(err.errors.name).to.exist;
        done();
      });
    });

    it('should be valid if required fields are not empty', done => {
      const mark = new Mark({
        name: 'name'
      });

      mark.validate(err => {
        chai.expect(err).to.not.exist;
        done();
      });
    });
  });

  describe('Model model', () => {
    it('should be invalid if required fields are empty', done => {
      const model = new Model();

      model.validate(err => {
        chai.expect(err.errors.markId).to.exist;
        chai.expect(err.errors.name).to.exist;
        done();
      });
    });

    it('should be valid if required fields are not empty', done => {
      const model = new Model({
        markId: 'markId',
        name: 'name'
      });

      model.validate(err => {
        chai.expect(err).to.not.exist;
        done();
      });
    });
  });

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

    it('should be valid if required fields are not empty', done => {
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

    it('should be able to compare passswords', async () => {
      const user = new User({
        email: 'test@email.com',
        name: 'Name',
        password: 'password'
      });

      await user.save();

      await user.comparePassword('password', (err: any, isMatching: boolean) => {
        chai.assert.isTrue(isMatching);
      });

      await user.comparePassword('password1', (err: any, isMatching: boolean) => {
        chai.assert.isNotTrue(isMatching);
      });

      await User.remove({ email: 'test@email.com' });
    });
  });
});

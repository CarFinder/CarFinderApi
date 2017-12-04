import { assert } from 'chai';
import { Ad, BodyType, Mark, Model } from '../src/db';
import { User } from '../src/db';
import { IAd } from '../src/interfaces';
import * as adRepository from '../src/repositories/adRepository';
import * as bodyTypeRepository from '../src/repositories/bodyTypeRepository';
import * as markRepository from '../src/repositories/markRepository';
import * as modelRepository from '../src/repositories/modelRepository';
import * as userRepository from '../src/repositories/userRepository';

describe('Repositories', () => {
  describe('Mark Repositories', () => {
    const marks = [
      {
        name: 'MarkRepoTest123'
      },
      {
        name: 'MarkRepoTest321'
      },
      {
        name: 'MarkRepoTest666'
      }
    ];
    before(async () => {
      await Mark.create(marks);
    });
    it('should return an array of marks', async () => {
      const result = await markRepository.getAll();
      assert.lengthOf(result, 3);
    });
    it('should return an object with mark if name passed is valid', async () => {
      const result = await markRepository.getByName(marks[0].name);
      assert(result.name, marks[0].name);
      assert.exists(result._id);
    });
    after(async () => {
      await Mark.remove({
        name: {
          $in: [marks[0].name, marks[1].name, marks[2].name]
        }
      });
    });
  });
  describe('Model Repositories', () => {
    const models = [
      {
        markId: 'modelrepotest1',
        name: 'ModelRepoTest123'
      },
      {
        markId: 'modelrepotest2',
        name: 'ModelRepoTest321'
      },
      {
        markId: 'modelrepotest3',
        name: 'ModelRepoTest666'
      }
    ];
    before(async () => {
      await Model.create(models);
    });
    it('should return an array of models', async () => {
      const result = await modelRepository.getAll();
      assert.lengthOf(result, 3);
    });
    it('should return an object with model if name passed is valid', async () => {
      const result = await modelRepository.getByName(models[0].name);
      assert(result.name, models[0].name);
      assert.exists(result._id);
    });
    after(async () => {
      await Model.remove({
        name: {
          $in: [models[0].name, models[1].name, models[2].name]
        }
      });
    });
  });
  describe('Ad Repositories', () => {
    const ads: any[] = [
      {
        bodyTypeId: 'repotestbodytypeidforad1',
        creationDate: new Date().getDate(),
        lastTimeUpDate: new Date().getDate(),
        markId: 'repotestmarkididforad1',
        modelId: 'repotestmodelididforad1',
        sourceName: 'repotestsourcenameidforad1',
        sourceUrl: 'repotestsourceurlidforad1',
        year: 2017
      },
      {
        bodyTypeId: 'repotestbodytypeidforad2',
        creationDate: new Date().getDate(),
        lastTimeUpDate: new Date().getDate(),
        markId: 'repotestmarkididforad2',
        modelId: 'repotestmodelididforad2',
        sourceName: 'repotestsourcenameidforad2',
        sourceUrl: 'repotestsourceurlidforad2',
        year: 2017
      },
      {
        bodyTypeId: 'repotestbodytypeidforad3',
        creationDate: new Date().getDate(),
        lastTimeUpDate: new Date().getDate(),
        markId: 'repotestmarkididforad3',
        modelId: 'repotestmodelididforad3',
        sourceName: 'repotestsourcenameidforad3',
        sourceUrl: 'repotestsourceurlidforad3',
        year: 2017
      }
    ];
    before(async () => {
      await Ad.create(ads);
    });
    it('should return an array of ads', async () => {
      const result = await adRepository.getAll();
      assert.lengthOf(result, 3);
    });
    it('should return an object with model if name passed is valid', async () => {
      const result = await adRepository.getAdByURL(ads[0].sourceUrl);
      assert(result.sourceUrl, ads[0].sourceUrl);
      assert.exists(result._id);
    });
    after(async () => {
      await Ad.remove({
        sourceUrl: {
          $in: [ads[0].sourceUrl, ads[1].sourceUrl, ads[2].sourceUrl]
        }
      });
    });
  });
  describe('User Repositories', () => {
    const users = [
      {
        confirmed: true,
        email: '666testtest@test.com',
        name: 'TestName',
        password: 'Password1#',
        subscription: true
      },
      {
        confirmed: true,
        email: '999testtest@test.com',
        name: 'TestName',
        password: 'Password1#',
        subscription: true
      },
      {
        confirmed: true,
        email: '888testtest@test.com',
        name: 'TestName',
        password: 'Password1#',
        subscription: false
      }
    ];
    const findParams = {
      subscription: true
    };
    before(async () => {
      await User.create(users);
    });
    it('should return an array of all users', async () => {
      const userData = await userRepository.getAllUsers();
      assert.lengthOf(userData, users.length);
    });
    it('should return an array of users with subscription', async () => {
      const userData = await userRepository.getAllUsersByField(findParams);
      assert.lengthOf(userData, 2);
    });
    after(async () => {
      await User.remove({
        email: {
          $in: [users[0].email, users[1].email, users[2].email]
        }
      });
    });
  });
});

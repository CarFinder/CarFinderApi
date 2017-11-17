import { assert } from 'chai';
import { User } from '../src/db';
import { getAllUsers } from '../src/repositories/userRepository';

describe('Newsletter', () => {
  const users = [
    {
      confirmed: true,
      email: '666testtest@test.com',
      name: 'TestName',
      password: 'Password1#'
    },
    {
      confirmed: true,
      email: '999testtest@test.com',
      name: 'TestName',
      password: 'Password1#'
    },
    {
      confirmed: true,
      email: '888testtest@test.com',
      name: 'TestName',
      password: 'Password1#'
    }
  ];
  describe('User Repository getAllUsers', () => {
    before(async () => {
      await User.create(users);
    });
    it('should return an array of users', async () => {
      const userData = await getAllUsers();
      assert.lengthOf(userData, 3);
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

import * as chai from 'chai';

import { getToken } from '../src/utils/index';

describe('SignIn', () => {
  it('should be able to generate jwt', () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InB1cGtpbkBtYWlsLmNvbSJ9.Si2nol4q-7SeMzCkyvm94s45CzP7kx3jG4y9OLdGcv4';
    chai.assert.equal(token, getToken({ email: 'pupkin@mail.com' }));
  });
});

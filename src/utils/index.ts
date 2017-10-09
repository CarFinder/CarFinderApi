import * as jwt from 'jsonwebtoken';

import { jwtSecret } from '../config/config';

export const getToken = (data: any) => {
  return jwt.sign(data, jwtSecret, { noTimestamp: true });
};

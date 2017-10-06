import * as jwt from 'jsonwebtoken';

import { jwtSecret } from '../config/config';

export const getToken = (user: any) => {
  return jwt.sign(user, jwtSecret);
};

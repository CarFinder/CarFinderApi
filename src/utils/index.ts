import * as jwt from 'jsonwebtoken';

import { jwtSecret } from '../config/config';
import { IUser } from '../interfaces/';

export const getToken = (user: IUser) => {
  return jwt.sign(user, jwtSecret);
};

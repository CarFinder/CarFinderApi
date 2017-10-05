import * as Koa from 'koa';
import * as passport from 'koa-passport';
import * as mongoose from 'mongoose';
import { Strategy as LocalStrategy } from 'passport-local';
import { UserService } from './index';

import { IUserModel } from '../db/index';
import { IUser } from '../interfaces/index';

passport.use(new LocalStrategy({
  passwordField: 'password',
  usernameField: 'email',
}, async (username, password, done) => {
  UserService.comparePassword(username, password, done);
}));

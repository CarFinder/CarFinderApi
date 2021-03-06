import * as Koa from 'koa';
import * as passport from 'koa-passport';
import * as mongoose from 'mongoose';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { UserService } from '../services';

import { jwtSecret } from '../config/config';
import { IUserModel } from '../db/';
import { IUser } from '../interfaces/';

passport.use(
  new LocalStrategy(
    {
      passwordField: 'password',
      usernameField: 'email'
    },
    async (username, password, done) => {
      UserService.comparePassword(username, password, done);
    }
  )
);

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret
};

passport.use(
  new JwtStrategy(jwtOptions, (payload, done) => {
    UserService.getUser(payload.email, done);
  })
);

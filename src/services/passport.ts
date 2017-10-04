import * as Koa from 'koa';
import * as passport from 'koa-passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../db/schemas/user';

passport.use(new LocalStrategy({
  passwordField: 'password',
  usernameField: 'email',
}, (username, password, done) => {
  console.log(username);
  done(null, {});
}));

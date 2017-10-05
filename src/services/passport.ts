import * as Koa from 'koa';
import * as passport from 'koa-passport';
import * as mongoose from 'mongoose';
import { Strategy as LocalStrategy } from 'passport-local';
import { IUserModel, User } from '../db/schemas/user';

passport.use(new LocalStrategy({
  passwordField: 'password',
  usernameField: 'email',
}, (username, password, done) => {
  User.findOne({ email: username }, (err: mongoose.Error, user: IUserModel) => {
    user.comparePassword(password);
  })
  done(null, {});
}));

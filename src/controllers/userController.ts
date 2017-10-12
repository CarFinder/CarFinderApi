import * as HttpStatus from 'http-status-codes';
import * as Koa from 'koa';
import * as passport from 'koa-passport';
import { codeErrors } from '../config/config';
import { IUser } from '../interfaces/';
import { confirmUserEmail, registerUser } from '../services/';
import { emailRegExp, getToken, nameRegExp, passwordRegExp } from '../utils';
import { SecureError } from '../utils/errors';

export const signUp = async (ctx: Koa.Context) => {
  try {
    const userData = ctx.request.body;
    if (
      !emailRegExp.test(userData.email) ||
      !nameRegExp.test(userData.name) ||
      !passwordRegExp.test(userData.password)
    ) {
      throw new SecureError(codeErrors.VALIDATION_ERROR);
    }
    await registerUser(ctx.request.body);
    ctx.status = HttpStatus.CREATED;
  } catch (err) {
    ctx.status = HttpStatus.CONFLICT;
    ctx.body = {
      error: err.data
    };
  }
};

export const confirmEmail = async (ctx: Koa.Context) => {
  try {
    const user = await confirmUserEmail(ctx.request.body);
    const token = getToken(user);
    ctx.status = HttpStatus.OK;
    ctx.body = {
      token
    };
  } catch (error) {
    ctx.status = HttpStatus.UNAUTHORIZED;
    ctx.body = { error: error.data };
  }
};

export const signin = async (ctx: Koa.Context) => {
  ctx.status = HttpStatus.OK;
  ctx.body = { token: getToken(ctx.state.user) };
};

import * as HttpStatus from 'http-status-codes';
import * as Koa from 'koa';
import * as passport from 'koa-passport';
import { IUser } from '../interfaces/index';
import { confirmUserEmail, registerUser } from '../services/index';
import { getToken } from '../utils';

export const signUp = async (ctx: Koa.Context) => {
  if (!ctx) {
    return;
  }
  try {
    await registerUser(ctx.request.body);
    ctx.status = HttpStatus.CREATED;
    ctx.body = 'OK';
  } catch (err) {
    ctx.status = HttpStatus.CONFLICT;
    ctx.body = {
      error: err.data
    };
  }
};

export const confirmEmail = async (ctx: Koa.Context) => {
  if (!ctx) {
    return;
  }

  try {
    const user = await confirmUserEmail(ctx.request.body);
    const token = getToken(user);
    ctx.status = HttpStatus.OK;
    ctx.body = {
      token
    };
  } catch (error) {
    ctx.status = HttpStatus.UNAUTHORIZED;
    ctx.body = error.message;
  }
};

export const signin = async (ctx: Koa.Context) => {
  ctx.status = HttpStatus.OK;
  ctx.body = { token: getToken(ctx.state.user) };
};

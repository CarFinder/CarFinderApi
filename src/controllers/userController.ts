import * as HttpStatus from 'http-status-codes';
import * as Koa from 'koa';
import { IUser } from '../interfaces/index';
import { registerUser } from '../services/index';

export const signUp = async (ctx: Koa.Context) => {
  if (!ctx) {
    return;
  }
  try {
    await registerUser(ctx.request.body);
    ctx.status = HttpStatus.OK;
    ctx.body = 'OK';
  } catch (err) {
    ctx.status = HttpStatus.CONFLICT;
    ctx.body = {
      error: err.data
    };
  }
};

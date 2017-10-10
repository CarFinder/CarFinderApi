import * as HttpStatus from 'http-status-codes';
import * as Koa from 'koa';
import * as passport from 'koa-passport';

import { getToken } from '../utils/';

export const signin = async (ctx: Koa.Context) => {
  ctx.status = HttpStatus.OK;
  ctx.body = { token: getToken(ctx.state.user) };
};

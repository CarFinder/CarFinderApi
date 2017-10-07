import * as Koa from 'koa';
import * as passport from 'koa-passport';

import { getToken } from '../utils/';

export const signin = async (ctx: Koa.Context) => {
  ctx.body = getToken(ctx.state.user);
};

import * as Koa from 'koa';

import { getToken } from '../utils/index';

export const signin = async (ctx: Koa.Context) => {
  ctx.body = { 
    message: 'Login successful!',
    token: getToken(ctx.state.user),
  };
}

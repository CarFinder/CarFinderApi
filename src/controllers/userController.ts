import * as Koa from 'koa';

import User from '../db/schemas/user';

export async function signin(ctx: Koa.Context) {
  global.console.log(ctx.request.body);
  ctx.body = { a: 231 };
}

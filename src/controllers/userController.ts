import * as Koa from 'koa';

export async function signin(ctx: Koa.Context) {
  global.console.log(ctx.request.body);
  ctx.body = { a: 231 };
}

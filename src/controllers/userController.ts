import * as Koa from 'koa';

export const signin = async (ctx: Koa.Context) => {
  console.log(ctx.state.user);
  const { email } = ctx.request.body;
  ctx.body = { email };
}

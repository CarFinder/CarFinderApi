import * as Koa from 'koa';
import * as passport from 'koa-passport';

export const jwtLogin = async (ctx: Koa.Context, next: any) => {
  return passport.authenticate(
    'jwt',
    { session: false },
    async (err: any, user?: any, message?: any) => {
      if (err) {
        ctx.body = { error: err };
      }
      if (user) {
        ctx.body = { message: 'success' };
      } else {
        ctx.body = { error: 'unautorized' };
      }
    }
  )(ctx, next);
};

export const localLogin = async (ctx: Koa.Context, next: any) => {
  return passport.authenticate(
    'local',
    { session: false },
    async (err: any, user?: any, message?: string) => {
      if (err) {
        ctx.body = { error: err };
      }
      if (user === false) {
        ctx.body = { error: message };
      }
      if (user) {
        ctx.state.user = user;
        await next();
      }
    }
  )(ctx, next);
};

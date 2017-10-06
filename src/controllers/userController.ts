import * as Koa from 'koa';
import * as passport from 'koa-passport';

import { getToken } from '../utils/index';

export const signin = async (ctx: Koa.Context, next: any) => {
  return passport.authenticate(
    'local',
    { session: false },
    (err: any, user?: any, message?: string) => {
      if (err) {
        ctx.body = { error: err };
      }
      if (user === false) {
        ctx.body = { error: message };
      }
      if (user) {
        ctx.body = { token: getToken(user) };
      }
    }
  )(ctx, next);
};

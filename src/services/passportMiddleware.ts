import * as HttpStatus from 'http-status-codes';
import * as Koa from 'koa';
import * as passport from 'koa-passport';

import { codeErrors } from '../config/config';
import { AuthError } from '../utils/errors';

export const jwtLogin = async (ctx: Koa.Context, next: any) => {
  return passport.authenticate(
    'jwt',
    { session: false },
    async (err: any, user?: any, message?: any) => {
      try {
        if (err) {
          throw new AuthError(codeErrors.AUTH_ERROR);
        }
        if (user) {
          await next();
        } else {
          throw new AuthError(codeErrors.AUTH_ERROR);
        }
      } catch (err) {
        ctx.status = HttpStatus.UNAUTHORIZED;
        ctx.body = { error: err.data };
      }
    }
  )(ctx, next);
};

export const localLogin = async (ctx: Koa.Context, next: any) => {
  return passport.authenticate('local', { session: false }, async (err: any, user?: any) => {
    try {
      if (err) {
        throw new AuthError(codeErrors.AUTH_ERROR);
      }
      if (user === false) {
        throw new AuthError(codeErrors.INCORRECT_EMAIL_OR_PASS);
      }
      if (user) {
        if (!user.confirmed) {
          throw new AuthError(codeErrors.ACCOUNT_NOT_ACTIVATED);
        }
        ctx.state.user = user;
        await next();
      }
    } catch (err) {
      ctx.status = HttpStatus.UNAUTHORIZED;
      ctx.body = { error: err.data };
    }
  })(ctx, next);
};

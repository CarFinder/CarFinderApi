import * as HttpStatus from 'http-status-codes';
import * as Koa from 'koa';
import * as passport from 'koa-passport';

import { codeErrors } from '../config/config';
import { emailRegExp, passwordRegExp } from '../utils';
import { SecureError } from '../utils/errors';

export const jwtLogin = async (ctx: Koa.Context, next?: any) => {
  return passport.authenticate(
    'jwt',
    { session: false },
    async (err: any, user?: any, message?: any) => {
      try {
        if (err) {
          throw new SecureError(codeErrors.AUTH_ERROR);
        }
        if (user) {
          ctx.state.user = {
            email: user.email,
            id: user._id
          };
          await next();
        } else {
          throw new SecureError(codeErrors.AUTH_ERROR);
        }
      } catch (err) {
        ctx.status = HttpStatus.UNAUTHORIZED;
        ctx.body = { error: err.data };
      }
    }
  )(ctx, next);
};

export const localLogin = async (ctx: Koa.Context, next: any) => {
  try {
    const userData = ctx.request.body;
    if (!emailRegExp.test(userData.email) || !passwordRegExp.test(userData.password)) {
      throw new SecureError(codeErrors.VALIDATION_ERROR);
    }
  } catch (err) {
    ctx.status = HttpStatus.UNAUTHORIZED;
    ctx.body = { error: err.data };
    return;
  }

  return passport.authenticate('local', { session: false }, async (err: any, user?: any) => {
    try {
      if (err) {
        throw new SecureError(codeErrors.AUTH_ERROR);
      }
      if (user === false) {
        throw new SecureError(codeErrors.INCORRECT_EMAIL_OR_PASS);
      }
      if (user) {
        if (!user.confirmed) {
          throw new SecureError(codeErrors.ACCOUNT_NOT_ACTIVATED);
        }
        ctx.state.user = {
          email: user.email,
          image: user.image,
          interfaceLanguage: user.interfaceLang,
          name: user.name,
          subscription: user.subscription
        };
        await next();
      }
    } catch (err) {
      ctx.status = HttpStatus.UNAUTHORIZED;
      ctx.body = { error: err.data };
    }
  })(ctx, next);
};

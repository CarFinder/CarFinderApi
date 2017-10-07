import * as passport from 'koa-passport';
import * as Router from 'koa-router';
import '../services/passport';

import { getToken } from '../utils/';

import { signin } from '../controllers/userController';

const router = new Router();

router.post(
  '/signin',
  async (ctx, next) => {
    return passport.authenticate(
      'local',
      { session: false },
      async (err: any, user?: any, message?: string) => {
        if (err) {
          ctx.body = err;
        }
        if (user === false) {
          ctx.body = message;
        }
        if (user) {
          await next();
        }
      }
    )(ctx, next);
  },
  signin
);

export default router;

import * as Koa from 'koa';
import * as passport from 'koa-passport';
import * as Router from 'koa-router';
import '../services/passport';
import { jwtLogin, localLogin } from '../services/passportMiddleware';

import { getToken } from '../utils/';

import { signin } from '../controllers/userController';

const router = new Router();

router.post('/signin', localLogin, signin);
router.post('/custom', jwtLogin);

export default router;

import * as Koa from 'koa';
import * as passport from 'koa-passport';
import * as Router from 'koa-router';
import { confirmEmail, signUp } from '../controllers/userController';
import { signin } from '../controllers/userController';
import '../passport/passport';
import { jwtLogin, localLogin } from '../passport/passportMiddleware';
import { getToken } from '../utils/';

const router = new Router();

router.post('/register', signUp);

router.post('/confirm', confirmEmail);

router.post('/signin', localLogin, signin);

export default router;

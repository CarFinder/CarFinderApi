import * as Koa from 'koa';
import * as passport from 'koa-passport';
import * as Router from 'koa-router';
import {
  confirmEmail,
  forgotPassword,
  restorePassword,
  signUp,
  updateData,
  updateImage,
  updateSettings
} from '../controllers/userController';
import { signin } from '../controllers/userController';
import '../passport/passport';
import { jwtLogin, localLogin } from '../passport/passportMiddleware';
import { getToken } from '../utils/';

const router = new Router();

router.post('/register', signUp);

router.post('/confirm', confirmEmail);

router.post('/signin', localLogin, signin);

router.post('/forgot', forgotPassword);

router.post('/restore', restorePassword);

router.post('/update-user-data', jwtLogin, updateData);

router.post('/update-user-settings', jwtLogin, updateSettings);

router.post('/update-user-image', jwtLogin, updateImage);

export default router;

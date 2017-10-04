import * as passport from 'koa-passport';
import * as Router from 'koa-router';
import '../services/passport';

import { signin } from '../controllers/userController';

const requireLogin = passport.authenticate('local', { session: false });

const router = new Router();

router.post('/signin', requireLogin, signin);

export default router;

import * as passport from 'koa-passport';
import * as Router from 'koa-router';
import '../services/passport';

import { signin } from '../controllers/userController';

const router = new Router();

router.post('/signin', signin);

export default router;

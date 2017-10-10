import * as Router from 'koa-router';
import { confirmEmail, signUp } from '../controllers/userController';

const router = new Router();

router.post('/register', signUp);

router.post('/confirm', confirmEmail);

export default router;

import * as Router from 'koa-router';
import { signUp } from '../controllers/userController';

const router = new Router();

router.post('/register', signUp);

export default router;

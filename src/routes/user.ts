import * as Router from 'koa-router';
import { signUp } from '../controllers/userController';

const router = new Router();

router.post('/register', async ctx => {
  try {
    await signUp(ctx.request.body);
    ctx.status = 200;
  } catch (error) {
    ctx.status = 400;
    ctx.body = {
      error: error.message
    };
  }
});

export default router;

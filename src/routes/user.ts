import * as Router from 'koa-router';

const router = new Router();

router.post('/register', async ctx => {
  try {
    ctx.status = 200;
  } catch (error) {
    ctx.status = 400;
    ctx.body = error;
  }
});

export default router;

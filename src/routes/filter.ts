import * as Router from 'koa-router';

const router = new Router();

router.get('/', async () => global.console.log('do something'));

export default router;

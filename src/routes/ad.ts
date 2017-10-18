import * as Router from 'koa-router';

import { getAds } from '../controllers/adController';

const router = new Router();

router.post('/', getAds);

export default router;

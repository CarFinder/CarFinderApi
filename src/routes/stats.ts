import * as Router from 'koa-router';

import { getStats } from '../controllers/statsController';

const router = new Router();

router.get('/landing-stats', getStats);

export default router;

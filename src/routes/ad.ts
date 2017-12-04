import * as Router from 'koa-router';

import { getAds, getLiquidity, getSavedSearchAds } from '../controllers/adController';

const router = new Router();

router.post('/', getAds);
router.get('/saved', getSavedSearchAds);
router.post('/get-liquidity', getLiquidity);

export default router;

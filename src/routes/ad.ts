import * as Router from 'koa-router';


import { getAds, getLiquidity, getMostLiquid,getSavedSearchAds } from '../controllers/adController';

const router = new Router();

router.post('/', getAds);
router.get('/saved', getSavedSearchAds);
router.get('/most_liquid', getMostLiquid);
router.post('/get_liquidity', getLiquidity);

export default router;

import * as Router from 'koa-router';

import { getAds, getSavedSearchAds } from '../controllers/adController';

const router = new Router();

router.get('/saved', getSavedSearchAds);
router.post('/', getAds);

export default router;

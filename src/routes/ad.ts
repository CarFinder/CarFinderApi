import * as Router from 'koa-router';

import { getAds, getSavedSearchAds } from '../controllers/adController';

const router = new Router();

router.post('/', getAds);
router.get('/saved', getSavedSearchAds);

export default router;

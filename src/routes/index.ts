import * as Router from 'koa-router';

import ad from './ad';
import filter from './filter';
import user from './user';

const router = new Router();

router.use('/ad', ad.routes());
router.use('/filter', filter.routes());
router.use('/user', user.routes());


export default router;

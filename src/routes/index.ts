import * as Router from 'koa-router';

import { jwtLogin } from '../passport/passportMiddleware';

import ad from './ad';
import filter from './filter';
import stats from './stats';
import user from './user';

const router = new Router();

router.use('/api/posts', jwtLogin, ad.routes());
router.use('/api/filter', jwtLogin, filter.routes());
router.use('/api/user', user.routes());
router.use('/api/stats', stats.routes());

export default router;

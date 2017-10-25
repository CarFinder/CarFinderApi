import * as Router from 'koa-router';

import { jwtLogin } from '../passport/passportMiddleware';

import ad from './ad';
import filter from './filter';
import user from './user';

const router = new Router();

router.use('/api/ad', jwtLogin, ad.routes());
router.use('/api/filter', jwtLogin, filter.routes());
router.use('/api/user', user.routes());

export default router;

import * as Router from 'koa-router';

import { getBodyTypes, getMarks, getModels } from '../controllers/filterController';

const router = new Router();

router.get('/marks', getMarks);
router.get('/bodyTypes', getBodyTypes);
router.post('/models', getModels);

export default router;

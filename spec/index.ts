import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as logger from 'koa-logger';
import * as passport from 'koa-passport';
import * as mongoose from 'mongoose';

import { db } from '../src/config/config';
import router from '../src/routes/index';

let app: any;
const server = new Koa();

mongoose.connect(db, { useMongoClient: true });
mongoose.set('debug', true);

server.use(bodyParser());
server.use(passport.initialize());
server.use(logger());

server.use(router.routes());

app = server.listen(3004);

export default app;

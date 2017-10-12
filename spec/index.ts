import * as dotenv from 'dotenv';
before(done => {
  dotenv.config();
  done();
});

import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as jwt from 'koa-jwt';
import * as passport from 'koa-passport';
import * as mongoose from 'mongoose';

import Bluebird = require('bluebird');

import { db } from '../src/config/config';

import routes from '../src/routes';

const server = new Koa();

mongoose.connect(db, { useMongoClient: true });

(mongoose as any).Promise = Bluebird;

server.use(bodyParser());
server.use(passport.initialize());

server.use(routes.routes());

const app: any = server.listen(3000);

export default app;

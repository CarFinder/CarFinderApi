import Bluebird = require('bluebird');
import * as dotenv from 'dotenv';
import schedule = require('node-schedule');
dotenv.config();
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as jwt from 'koa-jwt';
import * as logger from 'koa-logger';
import * as passport from 'koa-passport';
import * as mongoose from 'mongoose';
import { db, port, triggerSchedule } from './config/config';
import config from './config/test';
import routes from './routes';
import { getInfo } from './utils/parserUtils';

const server = new Koa();
// run parse api whe server started
getInfo();

// run sheduled parser task
const parse = schedule.scheduleJob(triggerSchedule, () => {
  getInfo();
});

mongoose.connect(db, { useMongoClient: true });
mongoose.set('debug', true);

(mongoose as any).Promise = Bluebird;

server.use(bodyParser());
server.use(passport.initialize());
server.use(logger());

server.use(routes.routes());

export const app: any = server.listen(port);

import * as bluebird from 'bluebird';
import * as dotenv from 'dotenv';
import * as schedule from 'node-schedule';
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
import { updateServiceData } from './utils/parserUtils';

const server = new Koa();

updateServiceData();

// update marks, models, bodyTypes, ads by schedule
// const parse = schedule.scheduleJob(triggerSchedule, async () => {
//   await updateServiceData();
// });

mongoose.connect(db, { useMongoClient: true });
mongoose.set('debug', true);

(mongoose as any).Promise = bluebird;

server.use(bodyParser());
server.use(passport.initialize());
server.use(logger());

server.use(routes.routes());

export const app: any = server.listen(port);

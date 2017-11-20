import * as bluebird from 'bluebird';
import * as dotenv from 'dotenv';
import * as schedule from 'node-schedule';
dotenv.config();
import * as https from 'https';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as jwt from 'koa-jwt';
import * as logger from 'koa-logger';
import * as passport from 'koa-passport';
import * as mongoose from 'mongoose';
import { db, healthCheckUrls, port, triggerSchedule } from './config/config';
import routes from './routes';
import { sendNewsletter } from './services';
import { updateServiceData } from './utils/parserUtils';

const server = new Koa();

const parse = schedule.scheduleJob(triggerSchedule, async () => {
  await updateServiceData();
  await https.get(healthCheckUrls.UPDATE);
  await sendNewsletter();
  await https.get(healthCheckUrls.NEWSLETTER);
});

mongoose.connect(db, { useMongoClient: true });
mongoose.set('debug', true);

(mongoose as any).Promise = bluebird;

server.use(bodyParser());
server.use(passport.initialize());
server.use(logger());

server.use(routes.routes());

export const app: any = server.listen(port);

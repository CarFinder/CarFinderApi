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
import { db, port, triggerSchedule } from './config/config';
import routes from './routes';
import { updateServiceData } from './utils/parserUtils';

// tslint:disable-next-line:no-var-requires
const cors = require('@koa/cors');

(mongoose as any).Promise = bluebird;

const server = new Koa();


const parse = schedule.scheduleJob(triggerSchedule, async () => {
  await updateServiceData();
  await https.get('https://hchk.io/c12a23b6-276d-4269-9316-d3353af47052');
});

mongoose.connect(db, { useMongoClient: true });
mongoose.set('debug', true);

server.use(cors());
server.use(bodyParser());
server.use(passport.initialize());
server.use(logger());

server.use(routes.routes());

export const app: any = server.listen(port);

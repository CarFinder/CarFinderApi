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
import { TempAd } from './db';
import routes from './routes';
import { calculateAllLiquidity } from './services';
import { updateDBData } from './services';
import { updateAvByData, updateOnlinerData } from './utils/parserUtils';
import { sendMessageToSlack } from './utils/slack';
import { torTriggerer } from './utils/torTriggerer';

// tslint:disable-next-line:no-var-requires
const cors = require('@koa/cors');

import { Api } from './parsers';


import * as cluster from 'cluster';
import * as os from 'os';

if (cluster.isMaster) {
  const cpuCount = os.cpus().length;
  for (let pInd = 0; pInd < cpuCount; pInd += 1) {
    cluster.fork();
  }

const parse = schedule.scheduleJob(triggerSchedule, async () => {
  try {
    torTriggerer.run();
    await updateDBData();
  } catch (err) {
    sendMessageToSlack(`The parser has been fallen with message: ${err}`);
  } finally {
    torTriggerer.close();
  }
  await https.get('https://hchk.io/c12a23b6-276d-4269-9316-d3353af47052');
  await calculateAllLiquidity();
});

  cluster.on('online', (worker) => {
    global.console.log('Worker ' + worker.process.pid + ' is online');
  });

  cluster.on('exit', (worker) => {
    global.console.log('Worker %d died :(', worker.id);
    cluster.fork();
  });


} else {
  const server = new Koa();

  mongoose.connect(db, { useMongoClient: true });
  mongoose.connect(db, { useMongoClient: true });
  mongoose.set('debug', true);

  (mongoose as any).Promise = bluebird;

  server.use(cors());
  server.use(bodyParser());
  server.use(passport.initialize());
  server.use(logger());

  server.use(routes.routes());

  server.listen(port);
}

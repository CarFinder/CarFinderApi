import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as logger from 'koa-logger';
import * as passport from 'koa-passport';
import * as mongoose from 'mongoose'; 

import Bluebird = require("bluebird");

import { db } from './config/config';

import routes from './routes';

const server = new Koa();

mongoose.connect(db, { useMongoClient: true });
mongoose.set('debug', true);

(mongoose as any).Promise = Bluebird;


server.use(bodyParser());
server.use(passport.initialize());
server.use(logger());

server.use(routes.routes());

server.listen(3000);

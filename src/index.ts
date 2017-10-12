import Bluebird = require('bluebird');
import * as dotenv from 'dotenv';
dotenv.config();
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as jwt from 'koa-jwt';
import * as logger from 'koa-logger';
import * as passport from 'koa-passport';
import * as mongoose from 'mongoose';
import config from './config/test';
import { trigger } from './parsers/onlinerParser/';
import routes from './routes';

const server = new Koa();

mongoose.connect(process.env.DB, { useMongoClient: true });
mongoose.set('debug', true);

(mongoose as any).Promise = Bluebird;

server.use(bodyParser());
server.use(passport.initialize());
server.use(logger());

server.use(routes.routes());

trigger();

export const app: any = server.listen(process.env.PORT || config.port);

console.log(1);
import Bluebird = require('bluebird');
import * as dotenv from 'dotenv';
dotenv.config();
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as jwt from 'koa-jwt';
import * as logger from 'koa-logger';
import * as passport from 'koa-passport';
import * as mongoose from 'mongoose';
import routes from './routes';

const server = new Koa();

mongoose.connect(process.env.DB, { useMongoClient: true });
mongoose.set('debug', true);

(mongoose as any).Promise = Bluebird;

server.use(bodyParser());
server.use(passport.initialize());
server.use(logger());

server.use(routes.routes());

export const app: any = server.listen(3000);

import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as logger from 'koa-logger';

import routes from './routes';

const server = new Koa();

server.use(bodyParser());
server.use(logger());

server.use(routes.routes());

server.listen(3000);

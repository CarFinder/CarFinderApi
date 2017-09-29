import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as logger from 'koa-logger';

const server = new Koa();

server.use(bodyParser());
server.use(logger());

server.listen(3000);

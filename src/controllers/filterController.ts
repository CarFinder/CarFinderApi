import * as HttpStatus from 'http-status-codes';
import * as Koa from 'koa';

import { FilterService } from '../services/index';

export const getMarks = async (ctx: Koa.Context) => {
  try {
    ctx.status = HttpStatus.OK;
    ctx.body = await FilterService.getAllMarks();
  } catch (err) {
    ctx.status = HttpStatus.NO_CONTENT;
  }
};

export const getBodyTypes = async (ctx: Koa.Context) => {
  try {
    ctx.status = HttpStatus.OK;
    ctx.body = await FilterService.getAllBodyTypes();
  } catch (err) {
    ctx.status = HttpStatus.NO_CONTENT;
  }
};

export const getModels = async (ctx: Koa.Context) => {
  try {
    ctx.status = HttpStatus.OK;
    ctx.body = await FilterService.getAllModelsByMark(ctx.request.body.markId);
  } catch (err) {
    ctx.status = HttpStatus.NO_CONTENT;
  }
};

import * as HttpStatus from 'http-status-codes';
import * as Koa from 'koa';

import { codeErrors } from '../config/config';
import { FilterService } from '../services/index';
import { DatabaseError, RequestError } from '../utils/errors';

export const getMarks = async (ctx: Koa.Context) => {
  try {
    ctx.status = HttpStatus.OK;
    ctx.body = await FilterService.getAllMarks();
  } catch (err) {
    ctx.status = HttpStatus.NO_CONTENT;
    ctx.body = new DatabaseError(codeErrors.INTERNAL_DB_ERROR);
  }
};

export const getBodyTypes = async (ctx: Koa.Context) => {
  try {
    ctx.status = HttpStatus.OK;
    ctx.body = await FilterService.getAllBodyTypes();
  } catch (err) {
    ctx.status = HttpStatus.NO_CONTENT;
    ctx.body = new DatabaseError(codeErrors.INTERNAL_DB_ERROR);
  }
};

export const getModels = async (ctx: Koa.Context) => {
  try {
    if (!ctx.request.body.markId) {
      ctx.status = HttpStatus.UNPROCESSABLE_ENTITY;
      ctx.body.error = new RequestError(codeErrors.REQUIRED_FIELD);
      return;
    }

    ctx.status = HttpStatus.OK;
    ctx.body = await FilterService.getAllModelsByMark(ctx.request.body.markId);
  } catch (err) {
    ctx.status = HttpStatus.NO_CONTENT;
    ctx.body = new DatabaseError(codeErrors.INTERNAL_DB_ERROR);
  }
};

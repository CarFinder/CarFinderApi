import * as HttpStatus from 'http-status-codes';
import * as Koa from 'koa';

import { codeErrors } from '../config/config';
import { FilterService } from '../services/index';
import { DatabaseError, RequestError } from '../utils/errors';

export const getMarks = async (ctx: Koa.Context) => {
  try {
    ctx.status = HttpStatus.OK;
    ctx.body = await FilterService.getAllMarks();
  } catch {
    ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
    ctx.body = { error: new DatabaseError(codeErrors.INTERNAL_DB_ERROR).data };
  }
};

export const getBodyTypes = async (ctx: Koa.Context) => {
  try {
    ctx.status = HttpStatus.OK;
    ctx.body = await FilterService.getAllBodyTypes();
  } catch {
    ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
    ctx.body = { error: new DatabaseError(codeErrors.INTERNAL_DB_ERROR).data };
  }
};

export const getModels = async (ctx: Koa.Context) => {
  try {
    if (!ctx.request.body.markId) {
      ctx.status = HttpStatus.UNPROCESSABLE_ENTITY;
      ctx.body = { error: new RequestError(codeErrors.REQUIRED_FIELD).data };
      return;
    }

    const models = await FilterService.getAllModelsByMark(ctx.request.body.markId);
    ctx.status = HttpStatus.OK;
    ctx.body = models;
  } catch {
    ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
    ctx.body = { error: new DatabaseError(codeErrors.INTERNAL_DB_ERROR).data };
  }
};

export const saveFilter = async (ctx: Koa.Context) => {
  try {
    if (!ctx.request.body.data.markId || !ctx.request.body.data.name) {
      ctx.status = HttpStatus.BAD_REQUEST;
      ctx.body = { error: new RequestError(codeErrors.REQUIRED_FIELD).data };
      return;
    }
    const token = ctx.request.header.authorization.split(' ')[1];
    await FilterService.saveSavedSearchFilter(ctx.request.body.data, token);
    ctx.status = HttpStatus.OK;
  } catch {
    ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
    ctx.body = { error: new DatabaseError(codeErrors.INTERNAL_DB_ERROR).data };
  }
};

export const getSavedFilters = async (ctx: Koa.Context) => {
  try {
    const token = ctx.request.header.authorization.split(' ')[1];
    const savedFilters = await FilterService.getSavedSearchFilters(token);
    ctx.status = HttpStatus.OK;
    ctx.body = savedFilters;
  } catch {
    ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
    ctx.body = { error: new DatabaseError(codeErrors.INTERNAL_DB_ERROR).data };
  }
};

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
      ctx.body = { error: new RequestError(codeErrors.VALIDATION_ERROR).data };
      return;
    }
    const user = ctx.state.user;
    await FilterService.saveSavedSearchFilter(ctx.request.body.data, user);
    ctx.status = HttpStatus.OK;
  } catch (error) {
    ctx.status = HttpStatus.BAD_REQUEST;
    ctx.body = { error: error.data };
  }
};

export const getSavedFilters = async (ctx: Koa.Context) => {
  try {
    const user = ctx.state.user;
    const savedFilters = await FilterService.getSavedSearchFilters(user);
    ctx.status = HttpStatus.OK;
    ctx.body = savedFilters;
  } catch (error) {
    ctx.status = HttpStatus.BAD_REQUEST;
    ctx.body = { error: error.data };
  }
};

export const removeAllSavedFilters = async (ctx: Koa.Context) => {
  try {
    const user = ctx.state.user;
    await FilterService.removeAllSavedFilters(user);
    ctx.status = HttpStatus.OK;
  } catch (error) {
    ctx.status = HttpStatus.BAD_REQUEST;
    ctx.body = { error: error.data };
  }
};

export const removeSavedFilterById = async (ctx: Koa.Context) => {
  try {
    if (!ctx.params.id) {
      ctx.status = HttpStatus.BAD_REQUEST;
      ctx.body = { error: new RequestError(codeErrors.VALIDATION_ERROR).data };
      return;
    }
    await FilterService.removeSavedFilterById(ctx.params.id);
    ctx.status = HttpStatus.OK;
  } catch (error) {
    ctx.status = HttpStatus.BAD_REQUEST;
    ctx.body = { error: error.data };
  }
};

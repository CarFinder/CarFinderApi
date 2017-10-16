import * as HttpStatus from 'http-status-codes';
import * as Koa from 'koa';

import { codeErrors } from '../config/config';
import { AdService } from '../services/';
import { DatabaseError, RequestError } from '../utils/errors';

export const getAds = async (ctx: Koa.Context) => {
  try {
    const { filter, limit, skip, sort } = ctx.request.body;

    if (!filter || !filter.markId) {
      ctx.status = HttpStatus.UNPROCESSABLE_ENTITY;
      ctx.body = { error: new RequestError(codeErrors.REQUIRED_FIELD).data };
      return;
    }

    const ads = await AdService.getAdsByFilter(filter, limit, skip, sort);
    ctx.status = HttpStatus.OK;
    ctx.body = ads;
  } catch (err) {
    ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
    ctx.body = { error: new DatabaseError(codeErrors.INTERNAL_DB_ERROR).data };
  }
};

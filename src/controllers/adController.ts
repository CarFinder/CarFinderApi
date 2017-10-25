import * as HttpStatus from 'http-status-codes';
import * as Koa from 'koa';

import { codeErrors } from '../config/config';
import { AdService, getAds as getAdsFromDb } from '../services/';
import { DatabaseError, RequestError } from '../utils/errors';
import { validateFilterRequest } from '../utils/validators';

export const getAds = async (ctx: Koa.Context) => {
  try {
    validateFilterRequest(ctx.request.body);
    const { filter, limit, skip, sort } = ctx.request.body;
    const ads = await getAdsFromDb(filter, limit, skip, sort);

    ctx.status = HttpStatus.OK;
    ctx.body = ads;
  } catch (err) {
    if (err.data) {
      ctx.status = HttpStatus.UNPROCESSABLE_ENTITY;
      ctx.body = { error: err.data };
    } else {
      ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = { error: new DatabaseError(codeErrors.INTERNAL_DB_ERROR).data };
    }
  }
};

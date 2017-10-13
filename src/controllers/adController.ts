import * as HttpStatus from 'http-status-codes';
import * as Koa from 'koa';

import { AdService } from '../services/';

export const getAds = async (ctx: Koa.Context) => {
  try {
    const { filter, limit, skip, sort } = ctx.request.body;

    if (!filter.markId) {
      throw new Error();
    }

    const ads = await AdService.getAdsByFilter(filter, limit, skip, sort);
    ctx.status = HttpStatus.OK;
    ctx.body = ads;
  } catch (err) {
    ctx.status = HttpStatus.UNPROCESSABLE_ENTITY;
  }
};

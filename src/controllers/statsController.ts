import * as HttpStatus from 'http-status-codes';
import * as Koa from 'koa';

import { codeErrors } from '../config/config';
import { StatsService } from '../services/index';
import { DatabaseError } from '../utils/errors';

export const getStats = async (ctx: Koa.Context) => {
  try {
    const stats = await StatsService.getStatsFromDatabase();
    ctx.status = HttpStatus.OK;
    ctx.body = stats;
  } catch {
    ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
    ctx.body = { error: new DatabaseError(codeErrors.INTERNAL_DB_ERROR).data };
  }
};

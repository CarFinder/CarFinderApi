import { codeErrors } from '../config/config';
import { IStats } from '../interfaces';
import { getStats } from '../repositories/statsRepository';
import { DatabaseError } from '../utils/errors';

export const getStatsFromDatabase = async (): Promise<IStats> => {
  try {
    return await getStats();
  } catch {
    throw new DatabaseError(codeErrors.INTERNAL_DB_ERROR);
  }
};

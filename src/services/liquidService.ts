import * as liquid from '../repositories/liquidityRepository';

export const count = async () => {
  return await liquid.count();
};

import * as liquid from '../repositories/liquidityRepository';

export const save = async (payload: any) => {
  await liquid.save(payload);
};

import * as mongoose from 'mongoose';
import { ILiquidityModel, Liquidity } from '../db';

export const getTopFive = async () => {
  return await Liquidity.find({})
    .limit(5)
    .sort({
      liquidityCoefficient: 1
    });
};

export const save = async (liquidity: any) => {
  const liq = new Liquidity(liquidity);
  await liq.save();
};

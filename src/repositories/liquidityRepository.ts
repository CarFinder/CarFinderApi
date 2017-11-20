import * as mongoose from 'mongoose';
import { ILiquidityModel, Liquidity } from '../db';

export const getTop = async (limit: number) => {
  return await Liquidity.find({})
    .limit(limit)
    .sort({
      liquidityCoefficient: 1
    });
};

export const save = async (liquidity: any) => {
  const liq = new Liquidity(liquidity);
  await liq.save();
};

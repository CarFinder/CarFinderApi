import * as mongoose from 'mongoose';

import { ILiquidity } from '../../interfaces';

export interface ILiquidityModel extends ILiquidity, mongoose.Document {}

const LiquiditySchema = new mongoose.Schema({
  bodyTypeId: {
    required: true,
    type: String
  },
  liquidityCoefficient: {
    required: true,
    type: Number
  },
  median: {
    required: true,
    type: Number
  },
  modelId: {
    required: true,
    type: String
  }
});

export { LiquiditySchema };

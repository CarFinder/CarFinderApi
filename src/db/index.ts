import * as mongoose from 'mongoose';
import { AdSchema, IAdModel } from './schemas/ad';
import { BodyTypeSchema, IBodyTypeModel } from './schemas/bodyType';
import { FilterSchema, IFilterModel } from './schemas/filter';
import { ILiquidityModel, LiquiditySchema } from './schemas/liquidity';
import { IMarkModel, MarkSchema } from './schemas/mark';
import { IModelModel, ModelSchema } from './schemas/model';
import { tempAdSchema } from './schemas/tempAd';
import { IUserModel, UserSchema } from './schemas/user';
export { IUserModel, IModelModel, IAdModel, IBodyTypeModel, IFilterModel, IMarkModel };

export const User: mongoose.Model<IUserModel> = mongoose.model<IUserModel>('User', UserSchema);

export const TempAd: mongoose.Model<IAdModel> = mongoose.model<IAdModel>('TempAd', tempAdSchema);

export const Model: mongoose.Model<IModelModel> = mongoose.model<IModelModel>('Model', ModelSchema);

export const Mark: mongoose.Model<IMarkModel> = mongoose.model<IMarkModel>('Mark', MarkSchema);

export const BodyType: mongoose.Model<IBodyTypeModel> = mongoose.model<IBodyTypeModel>(
  'BodyType',
  BodyTypeSchema
);

export const Liquidity: mongoose.Model<ILiquidityModel> = mongoose.model<ILiquidityModel>(
  'Liquidity',
  LiquiditySchema
);

export const Ad: mongoose.Model<IAdModel> = mongoose.model<IAdModel>('Ad', AdSchema);

export const Filter: mongoose.Model<IFilterModel> = mongoose.model<IFilterModel>(
  'Filter',
  FilterSchema
);

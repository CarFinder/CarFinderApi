import * as mongoose from 'mongoose';
import { AdSchema, IAdModel } from './schemas/ad';
import { BodyTypeSchema, IBodyTypeModel } from './schemas/bodyType';
import { FilterSchema, IFilterModel } from './schemas/filter';
import { IMarkModel, MarkSchema } from './schemas/mark';
import { IModelModel, ModelSchema } from './schemas/model';
import { IUserModel, UserSchema } from './schemas/user';

export { IUserModel, IModelModel, IAdModel, IBodyTypeModel, IFilterModel, IMarkModel };

export const User: mongoose.Model<IUserModel> = mongoose.model<IUserModel>('User', UserSchema);

export const Model: mongoose.Model<IModelModel> = mongoose.model<IModelModel>('Model', ModelSchema);

export const Mark: mongoose.Model<IMarkModel> = mongoose.model<IMarkModel>('Mark', MarkSchema);

export const BodyType: mongoose.Model<IBodyTypeModel> = mongoose.model<IBodyTypeModel>(
  'BodyType',
  BodyTypeSchema
);

export const Ad: mongoose.Model<IAdModel> = mongoose.model<IAdModel>('Ad', AdSchema);

export const Filter: mongoose.Model<IFilterModel> = mongoose.model<IFilterModel>(
  'Filter',
  FilterSchema
);

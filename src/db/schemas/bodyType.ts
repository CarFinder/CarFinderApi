import * as mongoose from 'mongoose';

import { IBodyType } from '../../interfaces';

export interface IBodyTypeModel extends IBodyType, mongoose.Document {}

const BodyTypeSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
      unique: true
    }
  },
  { versionKey: false }
);

export { BodyTypeSchema };

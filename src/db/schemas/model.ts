import * as mongoose from 'mongoose';

import { IModel } from '../../interfaces';

export interface IModelModel extends IModel, mongoose.Document {}

const ModelSchema = new mongoose.Schema({
  markId: {
    reuired: true,
    type: String
  },
  name: {
    required: true,
    type: String
  }
});

export { ModelSchema };

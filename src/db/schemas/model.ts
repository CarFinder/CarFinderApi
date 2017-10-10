import * as mongoose from 'mongoose';

const ModelSchema = {
  markId: {
    reuired: true,
    type: String
  },
  name: {
    required: true,
    type: String
  }
};

const Model = mongoose.model('Model', new mongoose.Schema(ModelSchema, { timestamps: true }));

export default Model;

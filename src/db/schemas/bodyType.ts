import * as mongoose from 'mongoose';

const BodyTypeSchema = {
  name: {
    required: true,
    type: String,
  },
};

const BodyType = mongoose.model('BodyType', new mongoose.Schema(BodyTypeSchema));

export default BodyType;

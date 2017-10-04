import * as mongoose from 'mongoose';

const MarkSchema = {
  name: {
    required: true,
    type: String,
  },
};

const Mark = mongoose.model('Mark', new mongoose.Schema(MarkSchema));

export default Mark;

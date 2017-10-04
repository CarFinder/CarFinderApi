import * as mongoose from 'mongoose';

const AdSchema = {
  bodyTypeId: {
    required: true,
    type: String,
  },
  description: {
    type: String,
  },
  images: {
    type: Array,
  },
  markId: {
    required: true,
    type: String,
  },
  milesFrom: {
    type: Number,
  },
  modelId: {
    required: true,
    type: String,
  },
  price: {
    type: Number,
  },
  sourceName: {
    required: true,
    type: String,
  },
  sourceUrl: {
    required: true,
    type: String,
  },
  year: {
    required: true,
    type: Number,
  }
};

const Ad = mongoose.model('Ad', new mongoose.Schema(AdSchema));

export default Ad;

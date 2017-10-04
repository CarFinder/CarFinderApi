import * as mongoose from 'mongoose';

const FilterSchema = {
  bodyTypeId: {
    type: String,
  },
  markId: {
    required: true,
    type: String,
  },
  maxMileFrom: {
    type: String,
  },
  maxPrice: {
    type: Number,
  },
  maxYear: {
    type: Number,
  },
  minMileFrom: {
    type: Number,
  },
  minPrice: {
    type: Number,
  },
  minYear: {
    type: Number,
  },
  modelId: {
    type: String,
  },
  userId: {
    required: true,
    type: String,
  },
};

const Filter = mongoose.model('Filter', new mongoose.Schema(FilterSchema));

export default Filter;

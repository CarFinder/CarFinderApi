import * as mongoose from 'mongoose';

import { IFilter } from '../../interfaces';

export interface IFilterModel extends IFilter, mongoose.Document {}

const FilterSchema = new mongoose.Schema({
  bodyTypeId: {
    type: String
  },
  markId: {
    required: true,
    type: String
  },
  maxMileFrom: {
    type: Number
  },
  maxPrice: {
    type: Number
  },
  maxYear: {
    type: Number
  },
  minMileFrom: {
    type: Number
  },
  minPrice: {
    type: Number
  },
  minYear: {
    type: Number
  },
  modelId: {
    type: String
  },
  name: {
    required: true,
    type: String
  },
  userId: {
    required: true,
    type: String
  }
});

export { FilterSchema };

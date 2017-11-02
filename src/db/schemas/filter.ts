import * as mongoose from 'mongoose';

import { IFilter } from '../../interfaces';

export interface IFilterModel extends IFilter, mongoose.Document {}

const FilterSchema = new mongoose.Schema(
  {
    bodyTypeId: {
      type: Array
    },
    kmsFrom: {
      type: Number
    },
    kmsTo: {
      type: Number
    },
    markId: {
      required: true,
      type: String
    },
    modelId: {
      type: Array
    },
    name: {
      required: true,
      type: String
    },
    priceFrom: {
      type: Number
    },
    priceTo: {
      type: Number
    },
    url: {
      type: String
    },
    userId: {
      required: true,
      type: String
    },
    yearFrom: {
      type: Number
    },
    yearTo: {
      type: Number
    }
  },
  { versionKey: false }
);

export { FilterSchema };

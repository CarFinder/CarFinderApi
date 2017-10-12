import * as mongoose from 'mongoose';

import { IAd } from '../../interfaces';

export interface IAdModel extends IAd, mongoose.Document {}

const AdSchema = new mongoose.Schema({
  bodyTypeId: {
    required: true,
    type: String
  },
  description: {
    type: String
  },
  images: {
    type: Array
  },
  markId: {
    required: true,
    type: String
  },
  milesFrom: {
    type: Number
  },
  modelId: {
    required: true,
    type: String
  },
  price: {
    type: Number
  },
  sourceName: {
    required: true,
    type: String
  },
  sourceUrl: {
    required: true,
    type: String
  },
  year: {
    required: true,
    type: Number
  }
});

export { AdSchema };

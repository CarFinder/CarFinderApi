import * as mongoose from 'mongoose';

import { IAd } from '../../interfaces';

export interface IAdModel extends IAd, mongoose.Document {}

const AdSchema = new mongoose.Schema(
  {
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
    kms: {
      type: Number
    },
    markId: {
      required: true,
      type: String
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
      type: String,
      unique: true
    },
    year: {
      required: true,
      type: Number
    }
  },
  { versionKey: false }
);

export { AdSchema };

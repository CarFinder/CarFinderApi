import * as mongoose from 'mongoose';

import { IAd } from '../../interfaces';

const tempAdSchema = new mongoose.Schema(
  {
    bodyTypeId: {
      required: true,
      type: String
    },
    creationDate: {
      required: true,
      type: Date
    },
    description: {
      type: String
    },
    images: {
      type: Array
    },
    isSold: {
      default: false,
      type: Boolean
    },
    kms: {
      type: Number
    },
    lastTimeUpDate: {
      required: true,
      type: Date
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

export { tempAdSchema };

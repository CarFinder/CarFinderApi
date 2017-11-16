import * as mongoose from 'mongoose';

import { IAd } from '../../interfaces';

const tempAdSchema = new mongoose.Schema(
  {
    creationDate: {
      type: String
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
      type: String
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
    soldDate: {
      default: '',
      type: String
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
  },
  { versionKey: false }
);

export { tempAdSchema };

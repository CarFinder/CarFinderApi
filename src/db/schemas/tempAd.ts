import * as mongoose from 'mongoose';

import { IAd } from '../../interfaces';

const tempAdSchema = new mongoose.Schema(
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
    isSelt: {
      default: false,
      type: Boolean
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

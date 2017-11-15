import * as mongoose from 'mongoose';

import { IAd } from '../../interfaces';

export interface IAdModel extends IAd, mongoose.Document {}

const AdSchema = new mongoose.Schema(
  {
    bodyTypeId: {
      required: true,
      type: String
    },
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

export { AdSchema };

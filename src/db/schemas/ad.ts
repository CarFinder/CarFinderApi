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
<<<<<<< HEAD
      required: true,
=======
>>>>>>> dev
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
<<<<<<< HEAD
      required: true,
=======
>>>>>>> dev
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
    soldDate: {
      type: Date
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

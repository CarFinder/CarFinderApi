export const db = process.env.DB;
export const jwtSecret = process.env.JWT_SECRET;
export const port = process.env.PORT;
export const proxy: string = process.env.PROXY;

export const limitForSavedFilters = 2;

export const mail = {
  auth: {
    pass: process.env.MAIL_PASS,
    user: process.env.MAIL_USER
  },
  service: 'Gmail'
};

// execute every 3 day
// see more adout config in dosc for node-schedule
export const triggerSchedule = '13 13 * * 2';

export const url = process.env.NOVE_ENV === 'production' ? 'carfinder.github.io' : 'localhost:3001';

export const codeErrors = {
  ACCOUNT_NOT_ACTIVATED: 103,
  AUTH_ERROR: 102,
  IMAGE_UPLOAD_ERROR: 106,
  INCORRECT_EMAIL_OR_PASS: 101,
  INTERNAL_DB_ERROR: 120,
  JWT_DECODE_ERROR: 104,
  MONGO_DUPLICATE_ERROR: 11000,
  ONLINER_PARSE_ERROR: 106,
  REQUIRED_FIELD: 110,
  VALIDATION_ERROR: 105
};

export enum sourceCodes {
  ONLINER = 1
}

export const ONLINER_URL: string = `https://ab.onliner.by/`;

export const emailActions = {
  CONFIRM_REGISTRATION: 'CONFIRM_REGISTRATION',
  RESTORE_PASSWORD: 'RESTORE_PASSWORD',
  UPDATE_EMAIL: 'UPDATE_EMAIL'
};

export const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: process.env.AWS_REGION,
  secretAccessKey: process.env.AWS_SECRET_KEY
};

export const bucket = process.env.AWS_BUCKET;

export const healthCheckUrls = {
  NEWSLETTER: 'https://hchk.io/cb2832f5-e7db-45d0-b8a5-d808f529b684',
  UPDATE: 'https://hchk.io/c12a23b6-276d-4269-9316-d3353af47052'
};

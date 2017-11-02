import config from './test';

export const db = process.env.DB || config.db;
export const jwtSecret = process.env.JWT_SECRET || config.jwt_secret;
export const port = process.env.PORT || config.port;
export const proxy = process.env.PROXY || config.proxy;
export const mail = {
  auth: {
    pass: process.env.MAIL_PASS || config.mailPass,
    user: process.env.MAIL_USER || config.mailUser
  },
  service: 'Gmail'
};

// execute every 3 day
// see more adout config in dosc for node-schedule

export const triggerSchedule = '*/3 * *';

export const url = process.env.DEV_CLIENT_HOST_URL || config.url;

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
  region: process.env.AWS_REGION || config.region,
  secretAccessKey: process.env.AWS_SECRET_KEY
};

export const bucket = config.bucket;

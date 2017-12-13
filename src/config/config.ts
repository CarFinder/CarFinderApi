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

export const url = 'localhost:3001';

export const maxFileLength = 2 * 1024 * 1024; // 2 MB

export const codeErrors = {
  ACCOUNT_NOT_ACTIVATED: 103,
  AUTH_ERROR: 102,
  AV_PARSE_ERROR: 107,
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
  AV = 2,
  ONLINER = 1
}

export const ONLINER_URL: string = `https://ab.onliner.by/`;
export const AV_URL: string = `https://cars.av.by/`;

export const emailActions = {
  CONFIRM_REGISTRATION: 'CONFIRM_REGISTRATION',
  RESTORE_PASSWORD: 'RESTORE_PASSWORD',
  SEND_USER_MESSAGE: 'SEND_USER_MESSAGE',
  UPDATE_EMAIL: 'UPDATE_EMAIL'
};

export const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: process.env.AWS_REGION,
  secretAccessKey: process.env.AWS_SECRET_KEY
};

export const bucket = process.env.AWS_BUCKET;

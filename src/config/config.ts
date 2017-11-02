export const db = process.env.DB;
export const jwtSecret = process.env.JWT_SECRET;
export const port = process.env.PORT;

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

export const url = process.env.DEV_CLIENT_HOST_URL;

export const codeErrors = {
  ACCOUNT_NOT_ACTIVATED: 103,
  AUTH_ERROR: 102,
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
  RESTORE_PASSWORD: 'RESTORE_PASSWORD'
};

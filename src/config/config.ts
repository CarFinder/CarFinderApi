import config from './test';

export const db = process.env.DB || config.db;
export const jwtSecret = process.env.JWT_SECRET || config.jwt_secret;

export const mail = {
  auth: {
    pass: process.env.MAIL_PASS || config.mailPass,
    user: process.env.MAIL_USER || config.mailUser
  },
  service: 'Gmail'
};

export const url = process.env.DEV_CLIENT_HOST_URL || config.url;

export const codeErrors = {
  ACCOUNT_NOT_ACTIVATED: 103,
  AUTH_ERROR: 102,
  INCORRECT_EMAIL_OR_PASS: 101,
  JWT_DECODE_ERROR: 104,
  MONGO_DUPLICATE_ERROR: 11000,
  VALIDATION_ERROR: 105
};

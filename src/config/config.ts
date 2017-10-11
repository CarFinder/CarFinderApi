export const db = process.env.DB;
export const jwtSecret = process.env.JWT_SECRET;

console.log(2);

export const mail = {
  auth: {
    pass: process.env.MAIL_PASS,
    user: process.env.MAIL_USER
  },
  service: 'Gmail'
};

export const url = process.env.DEV_CLIENT_HOST_URL;

export const codeErrors = {
  ACCOUNT_NOT_ACTIVATED: 103,
  AUTH_ERROR: 102,
  INCORRECT_EMAIL_OR_PASS: 101,
  JWT_DECODE_ERROR: 104,
  MONGO_DUPLICATE_ERROR: 11000
};

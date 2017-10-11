export const db = 'mongodb://Admin:passwordforadmin531@ds163494.mlab.com:63494/car-finder';
export const jwtSecret = 'superjwtsecretkey';

export const mail = {
  auth: {
    pass: 'gfhjkm123',
    user: 'carfinder.it@gmail.com'
  },
  service: 'Gmail'
};

export const url = 'localhost:3001';

export const codeErrors = {
  ACCOUNT_NOT_ACTIVATED: 103,
  AUTH_ERROR: 102,
  INCORRECT_EMAIL_OR_PASS: 101,
  JWT_DECODE_ERROR: 104,
  MONGO_DUPLICATE_ERROR: 11000,
  VALIDATION_ERROR: 105
};

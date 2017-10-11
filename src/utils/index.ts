import * as jwt from 'jsonwebtoken';
import nodemailer = require('nodemailer');
import { jwtSecret, mail, url } from '../config/config';
import { codeErrors } from '../config/config';
import { SecureError } from './errors';

const transport = nodemailer.createTransport(mail);

export const sendMail = (email: string, name: string): void => {
  const token: any = getToken({ email });
  const html = generateEmail(name, email, token);
  transport.sendMail(
    {
      from: 'Car Fdinder',
      html,
      subject: 'Confirma registration',
      to: email
    },
    err => {
      if (err) {
        throw err;
      }
    }
  );
};

const generateEmail = (name: string, email: string, token: string): string => {
  return `
  <div style="text-align: center;">
     <h1>Hi, ${name}!</h1>
     <p>To use CarFinder service, you should to follow the link.Best regards,CarFinder company :) </p>
     <a href="http://${url}/confirmation/?token=${token}" style="background-color: #319640; padding: 10px; text-decoration: none; border-radius: 5px; margin-top: 20px; display: inline-block;">Confirm</a>
  </div>
  `;
};

export const getToken = (data: any) => {
  return jwt.sign(data, jwtSecret, { noTimestamp: true });
};

export const decodeToken = (token: string) => {
  let decoded: any | null = null;
  jwt.verify(token, jwtSecret, (err, res: string) => {
    if (err) {
      throw new SecureError(codeErrors.JWT_DECODE_ERROR);
    }
    decoded = res;
  });
  return decoded;
};

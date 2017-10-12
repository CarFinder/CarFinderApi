import * as bcrypt from 'bcrypt-nodejs';
import * as jwt from 'jsonwebtoken';
import nodemailer = require('nodemailer');
import { codeErrors, emailActions, jwtSecret, mail, url } from '../config/config';
import { SecureError } from './errors';

const transport = nodemailer.createTransport(mail);

export const sendMail = (email: string, name: string, action: string): void => {
  const token: any = getToken({ email });
  const html = generateEmail(name, email, token, action);
  const subject = getEmailSubject(action);
  transport.sendMail(
    {
      from: 'Car Finder',
      html,
      subject,
      to: email
    },
    (err, info) => {
      global.console.log(`The mail sent to ${email}`);
      if (err) {
        throw err;
      }
    }
  );
};

const generateEmail = (name: string, email: string, token: string, action: string): string => {
  switch (action) {
    case emailActions.CONFIRM_REGISTRATION:
      return `
    <div style="text-align: center;">
       <h1>Hi, ${name}!</h1>
       <p>To use CarFinder service, you should to follow the link.Best regards,CarFinder company :) </p>
       <a href="http://${url}/confirmation/?token=${token}" style="background-color: #319640; padding: 10px; text-decoration: none; border-radius: 5px; margin-top: 20px; display: inline-block;">Confirm</a>
    </div>
    `;
    case emailActions.RESTORE_PASSWORD:
      return `
    <div style="text-align: center;">
       <h1>Hi, ${name}!</h1>
       <p>TYou are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
       <p>Please click on the following link, or paste this into your browser to complete the process</p>
       <a href="http://${url}/restore/?token=${token}" style="background-color: #319640; padding: 10px; text-decoration: none; border-radius: 5px; margin-top: 20px; display: inline-block;">Restore password</a>
       <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    </div>
    `;
  }
};

const getEmailSubject = (action: string) => {
  switch (action) {
    case emailActions.CONFIRM_REGISTRATION:
      return 'Confirm your registration';
    case emailActions.RESTORE_PASSWORD:
      return 'CarFinder Password Reset';
  }
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

export const encryptPassword = async (password: string) => {
  let encryptedPassword: string;
  let salt: string;
  salt = bcrypt.genSaltSync(10);
  encryptedPassword = bcrypt.hashSync(password, salt);
  return encryptedPassword;
};

export const nameRegExp = new RegExp(`^[a-zA-Zа-яёА-ЯЁ\s\'\-]+$`);
export const passwordRegExp = new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$');
export const emailRegExp = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$');

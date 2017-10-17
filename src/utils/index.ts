import * as jwt from 'jsonwebtoken';
import nodemailer = require('nodemailer');
import { jwtSecret, mail, url } from '../config/config';
import { codeErrors } from '../config/config';
import { Api } from '../parsers/';
import { updateMarks } from '../services/markService';
import { SecureError } from './errors';

const transport = nodemailer.createTransport(mail);

export const sendMail = (email: string, name: string): void => {
  const token: any = getToken({ email });
  const html = generateEmail(name, email, token);
  transport.sendMail(
    {
      from: 'Car Finder',
      html,
      subject: 'Confirm registration',
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

const transformOnlinerMarks = (marks: any) => {
  const transformedMarks = [];
  for (const mark of marks) {
    transformedMarks.push({
      name: mark.name,
      onlinerMarkId: mark.id
    });
  }
  return transformedMarks;
};

export const getMarksAndModels = async () => {
  const api = new Api(1);
  await api.updateMarks();
  const marks = api.getMarks();
  const currentMark = marks[0].id;
  await api.updateModels();
  const models = api.getModels();
  const transfomedMarks = transformOnlinerMarks(marks);
  await updateMarks(transfomedMarks);
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

export const nameRegExp = new RegExp(`^[a-zA-Zа-яёА-ЯЁ\s\'\-]+$`);
export const passwordRegExp = new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$');
export const emailRegExp = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$');

import nodemailer = require('nodemailer');
import { config, url } from '../config/config';

// config should be in evn

const transport = nodemailer.createTransport({
  auth: {
    pass: '61eb5425e14605',
    user: '69da9e08f6c079'
  },
  host: 'smtp.mailtrap.io',
  port: 2525
});

export const sendMail = (email: string, name: string): void => {
  const token: any = 'test';
  const html = generateEmail(name, email, token);
  transport.sendMail(
    {
      from: '"Car Fdinder 👻" <carfinder@cfgroup.com>',
      html,
      subject: 'Confirma registration',
      to: email
    },
    err => {
      if (err) {
        return err;
      }
    }
  );
};

const generateEmail = (name: string, email: string, token: string): string => {
  return `
  <div style="text-align: center;">
     <h1>Hi, ${name}!</h1>
     <p>To use CarFinder service, you should to follow the link.Best regards,CarFinder company :) </p>
     <a href="${url}/confirmation/?token=${token}" style="background-color: #ddd; color: #fff; padding: 10px; text-decoration: none; border-radius: 5px; margin-top: 20px; display: inline-block;">Reset Pass</a>
  </div>
  `;
};

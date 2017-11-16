import nodemailer = require('nodemailer');
import { mail } from '../config/config';
import { IMessage } from '../interfaces/index';
import { getEmailSubject } from './index';

const transport = nodemailer.createTransport(mail);

export const sendUserEmail = async (data: IMessage, action: string) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  const html = generateEmail(data.name, data.email, data.message);
  const subject = getEmailSubject(action);
  transport
    .sendMail({
      from: data.email,
      html,
      subject,
      to: mail.auth.user
    })
    .catch(error => {
      throw error;
    });
};

const generateEmail = (name: string, email: string, message: string): string => {
  return `
      <div style="background-color:#282834; padding: 10px; font-family: BlinkMacSystemFont, Segoe UI, Arial, sans-serif; ">
        <div style="background-color: white; border-radius: 5px;">
          <div style="background-color: white; padding: 40px 30px 30px; border-radius: 5px; color: #4a4a4a;">
            <h1>Message from ${name}</h1>
            <h2>Email: ${email}:</h2>
            <p style="margin-bottom: 40px;">${message}</p>
          </div>
        </div>
      </div>`;
};

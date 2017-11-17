import AWS = require('aws-sdk');
import * as bcrypt from 'bcrypt-nodejs';
import * as jwt from 'jsonwebtoken';
import nodemailer = require('nodemailer');
import {
  awsConfig,
  bucket,
  codeErrors,
  emailActions,
  jwtSecret,
  mail,
  url
} from '../config/config';
import { IUser, IUserImage } from '../interfaces/index';
import { DatabaseError, RequestError, SecureError } from './errors';

const transport = nodemailer.createTransport(mail);

AWS.config.update({
  accessKeyId: awsConfig.accessKeyId,
  region: awsConfig.region,
  secretAccessKey: awsConfig.secretAccessKey,
  signatureVersion: 'v4'
});

export const handleDatabaseError = (err: any) => {
  throw new DatabaseError(err.code);
};

export const sendMail = (email: string, name: string, language: string, action: string): void => {
  if (process.env.NODE_ENV !== 'test') {
    const token: any = getToken({ email });
    const html = generateEmail(name, email, language, token, action);
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
  }
};

const generateEmail = (
  name: string,
  email: string,
  language: string,
  token: string,
  action: string
): string => {
  const emailText: any = {
    en: {
      confirmButton: 'Confirm',
      confirmRegistration:
        'To use CarFinder service, please confirm your email by following the link. ' +
        'Best regards, CarFinder company :)',
      declineRequest:
        'If you did not request this, please ignore this email ' +
        'and your password will remain unchanged.',
      greetings: `Hi, ${name}!`,
      restoreButton: `Restore password`,
      restorePassword:
        'You are receiving this because you (or someone else) have requested ' +
        'the reset of the password for your account. Please click on the following link, ' +
        'or paste this into your browser to complete the process',
      updateEmail:
        'You are receiving this because you have requested to change your email. ' +
        'Your email was updated successfully.'
    },
    ru: {
      confirmButton: 'Подтвердить',
      confirmRegistration:
        'Чтобы воспользоваться сервисом CarFinder, подтвердите ваш е-мейл, ' +
        'перейдя по ссылке. С наилучшими пожеланиями, компания CarFinder :)',
      declineRequest:
        'Если вы не запрашивали изменение пароля, проигнорируйте это письмо ' +
        'и ваш пароль останется прежним',
      greetings: `Здравствуйте, ${name}!`,
      restoreButton: 'Восстановить пароль',
      restorePassword:
        'Вы получили это письмо, т.к. вы (или кто-то другой) запросили восстановление пароля для ' +
        'вашего аккаунта. Чтобы изменить пароль, пожалуйста нажмите на ссылку ниже, или вставьте ' +
        'ее в строку вашего браузера',
      updateEmail:
        'Вы получили это письмо, т.к. вы запросили смену е-мейла. Ваш е-мейл был изменен успешно.'
    }
  };
  const text = language === 'en' ? emailText.en : emailText.ru;
  switch (action) {
    case emailActions.CONFIRM_REGISTRATION:
      return `
      <div style="background-color:#282834; padding: 10px; font-family: BlinkMacSystemFont, Segoe UI, Arial, sans-serif; ">
        <div style="background-color: white; border-radius: 5px;">
          <div style="background-color: #ffdd57; color: #4a4a4a;  padding: 20px; border-radius: 5px 5px 0 0;">
            <span>CARFINDER</span>
          </div>
          <div style="background-color: white; padding: 40px 30px 30px; border-radius: 5px; color: #4a4a4a;">
            <h1>${text.greetings}</h1>
            <p style="margin-bottom: 40px;">${text.confirmRegistration}</p>
            <div style="display: flex; justify-content: flex-end;">
              <button style="padding: 0px; background-color: #ffdd57; margin-bottom: 20px; border-color: transparent; font-size: 0.9rem; border-radius: 3px;">
                <a href="http://${url}/confirmation/?token=${token}" style="display: block; padding: 10px; text-decoration: none; color: rgba(0, 0, 0, 0.7);">${text.confirmButton}</a>
              </button>
            </div>
            <hr style="color: #95989a">
            <p style="font-size: 12px; color: #95989a; text-align: center;">CarFinder by CarFinder Inc.  The source code is licensed under MIT.</p>
          </div>
        </div>
      </div>`;
    case emailActions.RESTORE_PASSWORD:
      return `
      <div style="background-color:#282834; padding: 10px; font-family: BlinkMacSystemFont, Segoe UI, Arial, sans-serif; ">
        <div style="background-color: white; border-radius: 5px;">
          <div style="background-color: #ffdd57; color: #4a4a4a;  padding: 20px; border-radius: 5px 5px 0 0;">
            <span>CARFINDER</span>
          </div>
          <div style="background-color: white; padding: 40px 30px 30px; border-radius: 5px; color: #4a4a4a;">
            <h1>${text.greetings}</h1>
            <p style="margin-bottom: 40px;">${text.restorePassword}</p>
            <div style="display: flex; justify-content: flex-end;">
              <button style="padding: 0px; background-color: #ffdd57; margin-bottom: 20px; border-color: transparent; font-size: 0.9rem; border-radius: 3px;">
                <a href="http://${url}/restore/?token=${token}" style="display: block; padding: 10px; text-decoration: none; color: rgba(0, 0, 0, 0.7);">${text.confirmButton}</a>
              </button>
            </div>
            <p style="margin-bottom: 40px;">${text.declineRequest}</p>
            <hr style="color: #95989a">
            <p style="font-size: 12px; color: #95989a; text-align: center;">CarFinder by CarFinder Inc.  The source code is licensed under MIT.</p>
          </div>
        </div>
      </div>`;
    case emailActions.UPDATE_EMAIL:
      return `
      <div style="background-color:#282834; padding: 10px; font-family: BlinkMacSystemFont, Segoe UI, Arial, sans-serif; ">
        <div style="background-color: white; border-radius: 5px;">
          <div style="background-color: #ffdd57; color: #4a4a4a;  padding: 20px; border-radius: 5px 5px 0 0;">
            <span>CARFINDER</span>
          </div>
          <div style="background-color: white; padding: 40px 30px 30px; border-radius: 5px; color: #4a4a4a;">
            <h1>${text.greetings}</h1>
            <p style="margin-bottom: 40px;">${text.updateEmail}</p>
            <hr style="color: #95989a">
            <p style="font-size: 12px; color: #95989a; text-align: center;">CarFinder by CarFinder Inc.  The source code is licensed under MIT.</p>
          </div>
        </div>
      </div>`;
  }
};

export const getEmailSubject = (action: string) => {
  switch (action) {
    case emailActions.CONFIRM_REGISTRATION:
      return 'Confirm your registration';
    case emailActions.RESTORE_PASSWORD:
      return 'CarFinder Password Reset';
    case emailActions.UPDATE_EMAIL:
      return 'Confirm New Email';
    case emailActions.SEND_USER_MESSAGE:
      return 'Message from user';
  }
};

export const getToken = (data: any) => {
  return jwt.sign(data, jwtSecret, { noTimestamp: true });
};

export const decodeToken = (token: string) => {
  let decoded: any | null = null;
  jwt.verify(token, jwtSecret, (err: any, res: any) => {
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

export const uploadImage = (id: string, userData: IUserImage) => {
  const s3Bucket = new AWS.S3();
  const buf = new Buffer(userData.image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  const params = {
    ACL: 'public-read',
    Body: buf,
    Bucket: bucket,
    ContentEncoding: 'base64',
    ContentType: userData.type,
    Key: id
  };
  s3Bucket.putObject(params, (error, data) => {
    if (error) {
      throw new RequestError(codeErrors.IMAGE_UPLOAD_ERROR);
    }
  });
  userData.image = s3Bucket.getSignedUrl('getObject', {
    Bucket: bucket,
    Key: id
  });
  return userData;
};

export const transformDataForMongo = (data: any) => {
  const payload = {
    ...(data.email && { email: data.email }),
    ...(data.image && { image: data.image }),
    ...(data.interfaceLanguage && { interfaceLang: data.interfaceLanguage }),
    ...(data.name && { name: data.name }),
    ...(data.subscription !== undefined && { subscription: data.subscription })
  };

  return payload;
};

export const transformDataForToken = (data: IUser) => {
  const transformedData = {
    confirmed: data.confirmed,
    email: data.email,
    image: data.image,
    interfaceLanguage: data.interfaceLang,
    name: data.name,
    password: data.password,
    subscription: data.subscription
  };

  return transformedData;
};

export const nameRegExp = new RegExp(`^[a-zA-Zа-яёА-ЯЁ\s\'\-]+$`);
export const passwordRegExp = new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$');
export const emailRegExp = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$');
export const yearRegExp = new RegExp('^(19[0-9][0-9]|200[0-9]|201[0-7])$');
export const positiveNumsRegExp = new RegExp('^[0-9][0-9]*$');

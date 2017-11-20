import * as nodemailer from 'nodemailer';
import { mail, url } from '../config/config';
import { IAdForClient } from '../interfaces/index';

const transport = nodemailer.createTransport(mail);

const sendNewsletter = async (name: string, email: string, ads: IAdForClient[]) => {
  const letterBody = generateEmail(name, ads);
  await transport.sendMail({
    from: 'CarFinder Newsletter',
    html: letterBody,
    subject: 'Newsletter',
    to: email
  });
  global.console.log(`Newsletter has been sent to ${email}`);
};

const generateEmail = (name: string, ads: IAdForClient[]) => {
  const listOfUrls: string[] = ads.map((ad: IAdForClient) => {
    return `<li><a href="${ad.sourceUrl}">${ad.mark} - ${ad.model} - ${ad.bodyType} - ${ad.price} USD - ${ad.year}</a></li>`;
  });
  const currentDate = new Date();
  return `
  <div style="background-color:#282834; padding: 10px; font-family: BlinkMacSystemFont, Segoe UI, Arial, sans-serif; ">
  <div style="background-color: white; border-radius: 5px;">
    <div style="background-color: #ffdd57; color: #4a4a4a;  padding: 20px; border-radius: 5px 5px 0 0;">     
      <span>CARFINDER</span>
    </div>
    <div style="background-color: white; padding: 40px 30px 30px; border-radius: 5px; color: #4a4a4a;">
      <h1>Hi, ${name}</h1>
      <p style="margin-bottom: 40px;">Newsletter based on your saved filters for ${currentDate.getDay()}-${currentDate.getMonth() +
    1}-${currentDate.getFullYear()}</p>
      <div style="display: flex; justify-content: flex-end;"> 
        <ul>
        ${listOfUrls}
        </ul>
      </div>
      <hr style="color: #95989a">
      <p style="font-size: 12px; color: #95989a; text-align: center;">CarFinder by CarFinder Inc.  The source code is licensed under MIT.</p>
    </div>
  </div>
</div>`;
};

export default sendNewsletter;

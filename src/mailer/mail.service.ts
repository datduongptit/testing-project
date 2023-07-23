import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
// import { PasswordService } from './password.service';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      // configure your email provider details here
      service: 'gmail',
      auth: {
        user: 'datduongptit@gmail.com',
        pass: 'irzciszjyqxwfkwh',
      },
    });
  }

  async sendPasswordResetConfirmation(
    email: string,
    newPassword: string,
  ): Promise<void> {
    const template = fs.readFileSync(
      './src/mailer/templates/reset-password.hbs',
      'utf8',
    );
    const compiledTemplate = handlebars.compile(template);
    const html = compiledTemplate({ email, newPassword });

    const mailOptions: nodemailer.SendMailOptions = {
      from: 'datduongptit@gmail.com',
      to: email,
      subject: 'Password Reset Confirmation',
      html,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // or any other email service you use
      auth: {
        user: 'kishan.lal.rai210121@gmail.com', // your email
        pass: 'clrh dapn zwoa jpvj', // your email password or app password
      },
    });
  }

  async sendResetPasswordEmail(email: string, resetUrl: string): Promise<void> {
    const mailOptions = {
      from: 'kishan.lr@codemonk.io',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
  async sendEmailVerificationMail(email: string, token: string): Promise<void> {
    const mailOptions = {
      from: 'kishan.lr@codemonk.io',
      to: email,
      subject: 'Verify Email Request',
      html: `
        <h1>Verify Email</h1>
        <p>You requested a Verify Email. by clicking on the link below:</p>
        <a href="${token}">verify email</a>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}

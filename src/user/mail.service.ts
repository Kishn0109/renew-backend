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
}

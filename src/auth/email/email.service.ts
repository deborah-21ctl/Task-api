import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  async sentOtpEmail(email: string, otp: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Password reset  OTP',
      text: `Your Password rest OTP is ${otp}. it expires in 10 minites.`,
    });
  }

  async testEmail(email: string, otp: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: 'Task API Email TEST',
      text: 'if you can see this email it means your nest.js email is working for this email',
      
    });
  }
}

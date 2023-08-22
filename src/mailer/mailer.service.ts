import { Injectable } from '@nestjs/common';
import { MailerService as Mailer } from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: Mailer) {}

  async sendMail(email: string, verificationCode: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Verification Code',
      template: './verification',
      context: {
        verificationCode,
      },
    });
  }
}

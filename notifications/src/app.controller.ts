import { MailerService } from '@nestjs-modules/mailer';
import { Controller } from '@nestjs/common';
import { RMQRoute } from 'nestjs-rmq';

@Controller()
export class AppController {
  constructor(private readonly mailerService: MailerService) {}

  @RMQRoute('notify')
  sendTestEmail(data: { title: string; description: string; email: string }) {
    console.log('-=-=', data);
    const res = this.mailerService.sendMail({
      to: 'iren171302@gmail.com',
      subject: 'Welcome to NestJS Nodemailer!',
      html: '<h1>He he</h1>',
    });

    return res;
  }
}

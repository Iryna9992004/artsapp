import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RMQModule } from 'nestjs-rmq';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    RMQModule.forRoot({
      exchangeName: 'Notification',
      connections: [
        {
          login: 'guest',
          password: 'guest',
          host: 'localhost',
          port: 5672,
        },
      ],
      queueName: 'notifications',
      prefetchCount: 32,
      serviceName: 'notifications',
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'iren171302@gmail.com',
          pass: 'bikp zena punv nray',
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

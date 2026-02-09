import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RMQModule } from 'nestjs-rmq';
import { MailerModule } from '@nestjs-modules/mailer';
import config from './config';

@Module({
  imports: [
    RMQModule.forRoot({
      exchangeName: config.rabbitmq.exchangeName,
      connections: [
        {
          login: config.rabbitmq.user,
          password: config.rabbitmq.password,
          host: config.rabbitmq.host,
          port: config.rabbitmq.port,
        },
      ],
      queueName: config.rabbitmq.queueName,
      prefetchCount: 32,
      serviceName: config.rabbitmq.serviceName,
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

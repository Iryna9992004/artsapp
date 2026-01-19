import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PgModule } from './pg/pg.module';
import { RMQModule } from 'nestjs-rmq';

@Module({
  controllers: [],
  providers: [],
  imports: [
    AuthModule,
    PgModule,
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
      serviceName: 'auth',
    }),
  ],
})
export class AppModule {}

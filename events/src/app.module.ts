import { Module } from '@nestjs/common';
import { PgModule } from './pg/pg.module';
import { EventsModule } from './events/interface/events.module';
import { RMQModule } from 'nestjs-rmq';

@Module({
  imports: [
    PgModule,
    EventsModule,
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
      serviceName: 'events',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

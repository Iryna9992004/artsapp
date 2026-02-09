import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { EventsModule } from './events/interface/events.module';
import { PostModule } from './posts/post.module';
import { TopicsModule } from './topics/topics.module';
import { EventsModule as FetchEventsModule } from './fetch-events/events.module';
import { PostsModule as FetchPostsModule } from './fetch-posts/interface/posts.module';
import { PgModule } from './pg/pg.module';
import { RedisdbModule } from './redisdb/redisdb.module';
import { ClickhouseModule } from './clickhouse/clickhouse.module';
import { RMQModule } from 'nestjs-rmq';
import config from './shared/config';

// Функція для створення опціонального RabbitMQ модуля
function getRabbitMQModule() {
  const enableRabbitMQ = process.env.ENABLE_RABBITMQ !== 'false';
  
  if (!enableRabbitMQ) {
    console.log('⚠️  RabbitMQ вимкнено (ENABLE_RABBITMQ=false)');
    return [];
  }

  // Перевірка, чи RabbitMQ доступний (опціонально)
  // Якщо не доступний, модуль все одно буде імпортований, але з'єднання буде встановлюватися пізніше
  return [
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
      serviceName: 'backend',
      // Додаємо опції для обробки помилок підключення
      queueOptions: {
        durable: false,
      },
      // Не зупиняємо додаток при помилці підключення
      prefetchCount: 32,
    }),
  ];
}

@Module({
  imports: [
    // Спільні модулі
    PgModule,
    RedisdbModule,
    ClickhouseModule,
    
    // Бізнес-модулі
    AuthModule,
    ChatModule,
    EventsModule,
    PostModule,
    
    // Fetch модулі (для читання з ClickHouse)
    TopicsModule,
    FetchEventsModule,
    FetchPostsModule,
    
    // RabbitMQ для спілкування з notifications (опціонально)
    // Якщо RabbitMQ не запущений, помилки будуть логуватися, але додаток продовжить працювати
    ...getRabbitMQModule(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

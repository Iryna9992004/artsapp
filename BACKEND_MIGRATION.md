# 🔄 Інструкція з об'єднання мікросервісів у Backend

Цей документ описує, як об'єднати мікросервіси (auth, chat, events, fetch, posts) в один backend сервіс.

## 📋 Структура нового Backend

```
backend/
├── src/
│   ├── main.ts                    # Точка входу (об'єднати з auth/main.ts)
│   ├── app.module.ts              # Головний модуль (об'єднати всі модулі)
│   │
│   ├── auth/                      # З auth/
│   │   ├── auth.module.ts
│   │   └── ...
│   │
│   ├── chat/                      # З chat/src/chat/
│   │   ├── chat.module.ts
│   │   └── ...
│   │
│   ├── events/                    # З events/src/events/
│   │   ├── events.module.ts
│   │   └── ...
│   │
│   ├── fetch/                     # З fetch/src/
│   │   ├── topics/
│   │   ├── events/
│   │   ├── posts/
│   │   └── ...
│   │
│   ├── posts/                     # З posts/src/posts/
│   │   ├── post.module.ts
│   │   └── ...
│   │
│   ├── pg/                        # Спільний модуль (з auth або chat)
│   │   ├── pg.module.ts
│   │   └── pg.service.ts
│   │
│   ├── redisdb/                   # З auth/src/redisdb/
│   │   └── ...
│   │
│   ├── clickhouse/                # З fetch/src/clickhouse/ (якщо потрібно)
│   │   └── ...
│   │
│   └── shared/
│       └── config/
│           └── index.ts           # Об'єднати конфігурації
│
├── package.json                   # Об'єднати залежності з усіх мікросервісів
├── tsconfig.json
├── nest-cli.json
└── Dockerfile
```

## 🔧 Кроки об'єднання

### 1. Створення структури backend

```bash
mkdir -p backend/src
cd backend
```

### 2. Копіювання файлів

```bash
# Копіюємо модулі з кожного мікросервісу
cp -r ../auth/src/auth backend/src/
cp -r ../chat/src/chat backend/src/
cp -r ../events/src/events backend/src/
cp -r ../fetch/src/topics backend/src/
cp -r ../fetch/src/events backend/src/fetch-events/  # Перейменувати щоб уникнути конфлікту
cp -r ../fetch/src/posts backend/src/fetch-posts/     # Перейменувати щоб уникнути конфлікту
cp -r ../posts/src/posts backend/src/
cp -r ../auth/src/pg backend/src/
cp -r ../auth/src/redisdb backend/src/
cp -r ../fetch/src/clickhouse backend/src/  # Якщо потрібно
```

### 3. Об'єднання package.json

Об'єднайте всі залежності з:
- `auth/package.json`
- `chat/package.json`
- `events/package.json`
- `fetch/package.json`
- `posts/package.json`

Приклад об'єднаного `backend/package.json`:

```json
{
  "name": "backend",
  "version": "0.0.1",
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/platform-socket.io": "^10.4.20",
    "@nestjs/websockets": "^10.4.20",
    "@clickhouse/client": "^1.12.1",
    "@depyronick/nestjs-clickhouse": "^2.0.2",
    "@keyv/redis": "^5.1.1",
    "@nestjs-modules/ioredis": "^2.0.2",
    "@nestjs/cache-manager": "^3.0.1",
    "bcryptjs": "^3.0.2",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.2",
    "cookie-parser": "^1.4.7",
    "dotenv": "^17.2.2",
    "ioredis": "^5.7.0",
    "jsonwebtoken": "^9.0.2",
    "nestjs-rmq": "^2.14.0",
    "pg": "^8.16.3",
    "socket.io": "^4.8.1",
    "reflect-metadata": "^0.2.0",
    "rxjs": "^7.8.1"
  }
}
```

### 4. Створення app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { EventsModule } from './events/interface/events.module';
import { TopicsModule } from './topics/topics.module';
import { FetchEventsModule } from './fetch-events/events.module';
import { FetchPostsModule } from './fetch-posts/interface/posts.module';
import { PostModule } from './posts/post.module';
import { PgModule } from './pg/pg.module';
import { RMQModule } from 'nestjs-rmq';

@Module({
  imports: [
    // Спільні модулі
    PgModule,
    
    // Бізнес-модулі
    AuthModule,
    ChatModule,
    EventsModule,
    PostModule,
    
    // Fetch модулі
    TopicsModule,
    FetchEventsModule,
    FetchPostsModule,
    
    // RabbitMQ для спілкування з notifications
    RMQModule.forRoot({
      exchangeName: 'Notification',
      connections: [
        {
          login: process.env.RABBITMQ_USER || 'admin',
          password: process.env.RABBITMQ_PASSWORD || '1111',
          host: process.env.RABBITMQ_HOST || 'localhost',
          port: Number(process.env.RABBITMQ_PORT) || 5672,
        },
      ],
      serviceName: 'backend',
    }),
  ],
})
export class AppModule {}
```

### 5. Створення main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import config from './shared/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(cookieParser());
  app.enableCors({ 
    origin: config.client.base_url, 
    credentials: true 
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  await app.listen(config.base.port);
  console.log(`🚀 Backend запущено на порту ${config.base.port}`);
}
bootstrap();
```

### 6. Об'єднання конфігурації

Створіть `backend/src/shared/config/index.ts` з усіма необхідними змінними:

```typescript
import * as dotenv from 'dotenv';
dotenv.config();

interface Config {
  base: {
    port: number;
  };
  pg: {
    name: string;
    user: string;
    password: string;
    host: string;
    port: number;
    type: string;
  };
  redis: {
    host: string;
    port: number;
    password: string;
  };
  clickhouse: {
    host: string;
    username: string;
    password: string;
    db: string;
  };
  jwt: {
    access_secret: string;
    refresh_secret: string;
  };
  client: {
    base_url: string;
  };
  frontend: {
    url: string;
  };
  rabbitmq: {
    host: string;
    port: number;
    user: string;
    password: string;
    exchangeName: string;
  };
}

const config: Config = {
  base: {
    port: Number(process.env.PORT) || 4000,
  },
  pg: {
    name: process.env.PG_NAME || '',
    user: process.env.PG_USER || '',
    password: process.env.PG_PASSWORD || '',
    host: process.env.PG_HOST || '',
    port: Number(process.env.PG_PORT) || 5432,
    type: process.env.DB_TYPE || 'postgres',
  },
  redis: {
    host: process.env.REDIS_HOST || '',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || '',
  },
  clickhouse: {
    host: process.env.CLICKHOUSE_HOST || '',
    username: process.env.CLICKHOUSE_USER || '',
    password: process.env.CLICKHOUSE_PASSWORD || '',
    db: process.env.CLICKHOUSE_DB || '',
  },
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET || '',
    refresh_secret: process.env.JWT_RESRESH_SECRET || '',
  },
  client: {
    base_url: process.env.CLIENT_BASE_URL || '',
  },
  frontend: {
    url: process.env.FRONTEND_URL || '',
  },
  rabbitmq: {
    host: process.env.RABBITMQ_HOST || 'localhost',
    port: Number(process.env.RABBITMQ_PORT) || 5672,
    user: process.env.RABBITMQ_USER || 'admin',
    password: process.env.RABBITMQ_PASSWORD || '1111',
    exchangeName: process.env.RABBITMQ_EXCHANGE_NAME || 'Notification',
  },
};

export default config;
```

### 7. Оновлення маршрутів

Переконайтеся, що всі контролери мають правильні префікси:
- `/auth/*` - для auth endpoints
- `/chat/*` - для chat endpoints
- `/events/*` - для events endpoints
- `/posts/*` - для posts endpoints
- `/fetch/*` - для fetch endpoints
- `/topics/*` - для topics endpoints

### 8. Dockerfile

Скопіюйте Dockerfile з одного з мікросервісів (наприклад, з auth) та оновіть контекст.

## ✅ Перевірка

Після об'єднання переконайтеся, що:

1. ✅ Всі модулі імпортуються правильно
2. ✅ Всі залежності встановлені (`npm install`)
3. ✅ Конфігурація працює з `.env` файлом
4. ✅ Всі endpoints доступні через один порт
5. ✅ WebSocket для chat працює
6. ✅ RabbitMQ підключення працює для notifications

## 🚀 Запуск

```bash
# Створення .env файлів
./setup-credentials.sh

# Запуск через Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Або локально
cd backend
npm install
npm run start:dev
```

## 📝 Примітки

- Всі старі мікросервіси (auth, chat, events, fetch, posts) можна видалити після успішного об'єднання
- Notifications залишається окремим мікросервісом
- Frontend тепер використовує один `NEXT_PUBLIC_API_URL` для всіх запитів

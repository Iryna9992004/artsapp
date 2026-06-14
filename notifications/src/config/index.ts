import * as dotenv from 'dotenv';
import * as path from 'path';

// Завантажуємо .env файл з кореня notifications папки
// Спочатку пробуємо з поточної директорії (для запуску з кореня проекту)
dotenv.config({ path: path.resolve(process.cwd(), 'notifications/.env') });

// Якщо не знайдено, пробуємо з кореня notifications папки
if (!process.env.RABBITMQ_HOST) {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

// Якщо все ще не знайдено, використовуємо стандартний шлях
if (!process.env.RABBITMQ_HOST) {
  dotenv.config();
}

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
  rabbitmq: {
    host: string;
    port: number;
    user: string;
    password: string;
    exchangeName: string;
    queueName: string;
    serviceName: string;
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
    port: Number(process.env.PG_PORT) || 5434,
    type: process.env.DB_TYPE || '',
  },
  rabbitmq: {
    host: process.env.RABBITMQ_HOST || 'localhost',
    port: Number(process.env.RABBITMQ_PORT) || 5672,
    user: process.env.RABBITMQ_USER || 'admin',
    password: process.env.RABBITMQ_PASSWORD || '1111',
    exchangeName: process.env.RABBITMQ_EXCHANGE_NAME || 'Notification',
    queueName: process.env.RABBITMQ_QUEUE_NAME || 'notifications',
    serviceName: process.env.RABBITMQ_SERVICE_NAME || 'notifications',
  },
};

// Логування для діагностики (тільки в режимі розробки)
if (process.env.NODE_ENV !== 'production') {
  console.log('🔧 RabbitMQ Config:', {
    host: config.rabbitmq.host,
    port: config.rabbitmq.port,
    user: config.rabbitmq.user,
    password: config.rabbitmq.password ? '***' : 'NOT SET',
    exchangeName: config.rabbitmq.exchangeName,
  });
}

export default config;

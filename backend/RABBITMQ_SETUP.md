# Налаштування RabbitMQ

## Проблема: Failed to connect to RMQ

Якщо ви бачите помилки `ECONNREFUSED` при підключенні до RabbitMQ, це означає, що RabbitMQ не запущений.

## Рішення 1: Запустити RabbitMQ

Запустіть RabbitMQ через `setup.sh`:

```bash
./setup.sh
```

Це автоматично запустить RabbitMQ контейнер з credentials:
- Host: localhost
- Port: 5672
- User: admin
- Password: 1111

## Рішення 2: Вимкнути RabbitMQ (якщо не використовується)

Якщо ви не використовуєте notifications мікросервіс, можете вимкнути RabbitMQ:

1. Відредагуйте `backend/.env`:
```env
ENABLE_RABBITMQ=false
```

2. Перезапустіть backend

## Перевірка статусу RabbitMQ

```bash
# Перевірити, чи запущений контейнер
docker ps | grep rabbitmq

# Перевірити статус RabbitMQ
docker exec rabbitmq rabbitmqctl status

# Доступ до Management UI
# http://localhost:15672 (admin/1111)
```

## Налаштування в .env

У файлі `backend/.env` мають бути наступні змінні:

```env
ENABLE_RABBITMQ=true
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=1111
RABBITMQ_EXCHANGE_NAME=Notification
```

Якщо RabbitMQ запущений в Docker, використовуйте:
- `RABBITMQ_HOST=rabbitmq` (для Docker Compose)
- `RABBITMQ_HOST=localhost` (для локального запуску)

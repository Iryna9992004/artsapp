#!/bin/bash

# Скрипт для автоматичного створення .env файлів у всіх папках
# Використання: 
#   ./setup-credentials.sh                    # Використовує localhost/127.0.0.1
#   ./setup-credentials.sh 192.168.1.100      # Використовує переданий IP для всіх сервісів
# Структура: backend (об'єднаний), frontend, notifications (окремий мікросервіс)

set -e

# Перевірка параметра IP
SERVICES_IP="${1:-}"

echo "🔐 Створення .env файлів для всіх сервісів..."
if [ -n "$SERVICES_IP" ]; then
    echo "📍 Використовується IP для всіх сервісів: $SERVICES_IP"
else
    echo "📍 Використовуються локальні адреси (localhost/127.0.0.1)"
fi
echo ""

# Базові налаштування (можна змінити через змінні оточення)
# Якщо передано IP як параметр, використовуємо його для всіх HOST
if [ -n "$SERVICES_IP" ]; then
    DB_HOST="${DB_HOST:-$SERVICES_IP}"
    REDIS_HOST="${REDIS_HOST:-$SERVICES_IP}"
    CLICKHOUSE_HOST="${CLICKHOUSE_HOST:-$SERVICES_IP}"
    RABBITMQ_HOST="${RABBITMQ_HOST:-$SERVICES_IP}"
    FRONTEND_URL="${FRONTEND_URL:-http://${SERVICES_IP}:3000}"
    CLIENT_BASE_URL="${CLIENT_BASE_URL:-http://${SERVICES_IP}:3000}"
else
    DB_HOST="${DB_HOST:-localhost}"
    REDIS_HOST="${REDIS_HOST:-127.0.0.1}"
    CLICKHOUSE_HOST="${CLICKHOUSE_HOST:-127.0.0.1}"
    RABBITMQ_HOST="${RABBITMQ_HOST:-localhost}"
    FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
    CLIENT_BASE_URL="${CLIENT_BASE_URL:-http://localhost:3000}"
fi

DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-1111}"
DB_NAME="${DB_NAME:-artsapp}"
DB_TYPE="${DB_TYPE:-postgres}"

REDIS_PORT="${REDIS_PORT:-6379}"
REDIS_PASSWORD="${REDIS_PASSWORD:-1111}"

CLICKHOUSE_USER="${CLICKHOUSE_USER:-clickhouse}"
CLICKHOUSE_PASSWORD="${CLICKHOUSE_PASSWORD:-1111}"
CLICKHOUSE_DB="${CLICKHOUSE_DB:-clickhouse}"

RABBITMQ_PORT="${RABBITMQ_PORT:-5672}"
RABBITMQ_USER="${RABBITMQ_USER:-admin}"
RABBITMQ_PASSWORD="${RABBITMQ_PASSWORD:-1111}"

# JWT секрети (генеруються автоматично, якщо не встановлені)
if [ -z "$JWT_ACCESS_SECRET" ]; then
    JWT_ACCESS_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "change_this_to_strong_random_secret_for_access_tokens")
fi
if [ -z "$JWT_REFRESH_SECRET" ]; then
    JWT_REFRESH_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "change_this_to_strong_random_secret_for_refresh_tokens")
fi

# Порти сервісів
BACKEND_PORT="${BACKEND_PORT:-4000}"
NOTIFICATIONS_PORT="${NOTIFICATIONS_PORT:-4005}"

# Функція для створення .env файлу
create_env_file() {
    local service_dir=$1
    local env_content=$2
    
    if [ -d "$service_dir" ]; then
        local env_file="$service_dir/.env"
        echo "$env_content" > "$env_file"
        echo "✅ Створено: $env_file"
        return 0
    else
        echo "⚠️  Папка не знайдена: $service_dir"
        return 1
    fi
}

# 1. Frontend .env
echo "1️⃣  Створення frontend/.env..."
# Формуємо URL для API на основі переданого IP або localhost
if [ -n "$SERVICES_IP" ]; then
    API_URL="http://${SERVICES_IP}:${BACKEND_PORT}"
else
    API_URL="http://localhost:${BACKEND_PORT}"
fi
FRONTEND_ENV="NEXT_PUBLIC_API_URL=${API_URL}

"
create_env_file "frontend" "$FRONTEND_ENV"

# 2. Backend .env (об'єднаний сервіс з auth, chat, events, fetch, posts)
echo "2️⃣  Створення backend/.env..."
# DB_NAME для ClickHouse має бути artsapp_sync (реплікована база)
CLICKHOUSE_DB_NAME="${DB_NAME}_sync"
BACKEND_ENV="PORT=${BACKEND_PORT}

# PostgreSQL
PG_NAME=${DB_NAME}
PG_USER=${DB_USER}
PG_PASSWORD=${DB_PASSWORD}
PG_HOST=${DB_HOST}
PG_PORT=${DB_PORT}
DB_TYPE=${DB_TYPE}

# Redis
REDIS_HOST=${REDIS_HOST}
REDIS_PORT=${REDIS_PORT}
REDIS_PASSWORD=${REDIS_PASSWORD}

# ClickHouse
CLICKHOUSE_HOST=${CLICKHOUSE_HOST}
CLICKHOUSE_USER=${CLICKHOUSE_USER}
CLICKHOUSE_PASSWORD=${CLICKHOUSE_PASSWORD}
CLICKHOUSE_DB=${CLICKHOUSE_DB}

# DB для fetch модуля (ClickHouse база з реплікацією)
DB_NAME=${CLICKHOUSE_DB_NAME}

# JWT
JWT_ACCESS_SECRET=${JWT_ACCESS_SECRET}
JWT_RESRESH_SECRET=${JWT_REFRESH_SECRET}

# Client
CLIENT_BASE_URL=${CLIENT_BASE_URL}
FRONTEND_URL=${FRONTEND_URL}

# RabbitMQ (для спілкування з notifications)
# Встановіть ENABLE_RABBITMQ=false, якщо RabbitMQ не запущений
ENABLE_RABBITMQ=${ENABLE_RABBITMQ:-true}
RABBITMQ_HOST=${RABBITMQ_HOST}
RABBITMQ_PORT=${RABBITMQ_PORT}
RABBITMQ_USER=${RABBITMQ_USER}
RABBITMQ_PASSWORD=${RABBITMQ_PASSWORD}
RABBITMQ_EXCHANGE_NAME=Notification
"
create_env_file "backend" "$BACKEND_ENV"

# 3. Notifications .env (окремий мікросервіс)
echo "3️⃣  Створення notifications/.env..."
NOTIFICATIONS_ENV="PORT=${NOTIFICATIONS_PORT}

# PostgreSQL
PG_NAME=${DB_NAME}
PG_USER=${DB_USER}
PG_PASSWORD=${DB_PASSWORD}
PG_HOST=${DB_HOST}
PG_PORT=${DB_PORT}
DB_TYPE=${DB_TYPE}

# Redis
REDIS_HOST=${REDIS_HOST}
REDIS_PORT=${REDIS_PORT}
REDIS_PASSWORD=${REDIS_PASSWORD}

# RabbitMQ
RABBITMQ_HOST=${RABBITMQ_HOST}
RABBITMQ_PORT=${RABBITMQ_PORT}
RABBITMQ_USER=${RABBITMQ_USER}
RABBITMQ_PASSWORD=${RABBITMQ_PASSWORD}
RABBITMQ_EXCHANGE_NAME=Notification
RABBITMQ_QUEUE_NAME=notifications
RABBITMQ_SERVICE_NAME=notifications

# Frontend
FRONTEND_URL=${FRONTEND_URL}
CLIENT_BASE_URL=${CLIENT_BASE_URL}
"
create_env_file "notifications" "$NOTIFICATIONS_ENV"

# 4. DB .env (для міграцій)
echo "4️⃣  Створення db/.env..."
DB_ENV="CLICKHOUSE_HOST=${CLICKHOUSE_HOST}
CLICKHOUSE_USER=${CLICKHOUSE_USER}
CLICKHOUSE_PASSWORD=${CLICKHOUSE_PASSWORD}
CLICKHOUSE_DB=${CLICKHOUSE_DB}
CLICKHOUSE_MIGRATIONS_DIR=../migrations
CLICKHOUSE_DEFAULT_ACCESS_MANAGEMENT=1

PG_NAME=${DB_NAME}
PG_USER=${DB_USER}
PG_PASSWORD=${DB_PASSWORD}
PG_HOST=${DB_HOST}
PG_PORT=${DB_PORT}
DB_TYPE=${DB_TYPE}

REDIS_PASSWORD=${REDIS_PASSWORD}
"
create_env_file "db" "$DB_ENV"

echo ""
echo "🎉 Всі .env файли створені успішно!"
echo ""
echo "📝 Створені файли:"
echo "   - frontend/.env"
echo "   - backend/.env (об'єднаний сервіс)"
echo "   - notifications/.env (окремий мікросервіс)"
echo "   - db/.env"
echo ""
echo "💡 Ви можете змінити значення в цих файлах за потреби"
echo "💡 Для production використовуйте сильніші паролі та секрети!"
echo ""
echo "📋 Налаштування можна змінити через змінні оточення перед запуском:"
echo "   export DB_PASSWORD=your_password"
echo "   export JWT_ACCESS_SECRET=your_secret"
echo "   ./setup-credentials.sh"
echo ""
echo "📋 Або передати IP для всіх сервісів:"
echo "   ./setup-credentials.sh 192.168.1.100"
echo ""
echo "📌 Структура:"
echo "   - backend: об'єднує auth, chat, events, fetch, posts"
echo "   - frontend: Next.js додаток"
echo "   - notifications: окремий мікросервіс для сповіщень"
echo ""
if [ -n "$SERVICES_IP" ]; then
    echo "✅ Всі сервіси налаштовані на IP: $SERVICES_IP"
    echo "   - PostgreSQL: $DB_HOST:$DB_PORT"
    echo "   - Redis: $REDIS_HOST:$REDIS_PORT"
    echo "   - ClickHouse: $CLICKHOUSE_HOST"
    echo "   - RabbitMQ: $RABBITMQ_HOST:$RABBITMQ_PORT"
    echo "   - Frontend URL: $FRONTEND_URL"
fi
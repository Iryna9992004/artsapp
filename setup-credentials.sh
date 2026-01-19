#!/bin/bash

# Скрипт для автоматичного створення .env файлів у всіх папках
# Використання: ./setup-credentials.sh

set -e

echo "🔐 Створення .env файлів для всіх сервісів..."
echo ""

# Базові налаштування (можна змінити через змінні оточення)
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-1111}"
DB_NAME="${DB_NAME:-artsapp}"
DB_TYPE="${DB_TYPE:-postgres}"

REDIS_HOST="${REDIS_HOST:-127.0.0.1}"
REDIS_PORT="${REDIS_PORT:-6379}"
REDIS_PASSWORD="${REDIS_PASSWORD:-1111}"

CLICKHOUSE_HOST="${CLICKHOUSE_HOST:-http://127.0.0.1:8123}"
CLICKHOUSE_USER="${CLICKHOUSE_USER:-clickhouse}"
CLICKHOUSE_PASSWORD="${CLICKHOUSE_PASSWORD:-1111}"
CLICKHOUSE_DB="${CLICKHOUSE_DB:-clickhouse}"

FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
CLIENT_BASE_URL="${CLIENT_BASE_URL:-http://localhost:3001}"

# JWT секрети (генеруються автоматично, якщо не встановлені)
if [ -z "$JWT_ACCESS_SECRET" ]; then
    JWT_ACCESS_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "change_this_to_strong_random_secret_for_access_tokens")
fi
if [ -z "$JWT_REFRESH_SECRET" ]; then
    JWT_REFRESH_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "change_this_to_strong_random_secret_for_refresh_tokens")
fi

# Порти сервісів
AUTH_PORT="${AUTH_PORT:-4000}"
CHAT_PORT="${CHAT_PORT:-4001}"
EVENTS_PORT="${EVENTS_PORT:-4002}"
FETCH_PORT="${FETCH_PORT:-4003}"
POSTS_PORT="${POSTS_PORT:-4004}"

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

# 1. Frontend .env (рядки 1-20)
echo "1️⃣  Створення frontend/.env..."
FRONTEND_ENV="NEXT_PUBLIC_API_URL=http://localhost:${AUTH_PORT}

NEXT_PUBLIC_CHAT_API_URL=http://localhost:${CHAT_PORT}

NEXT_PUBLIC_EVENTS_API_URL=http://localhost:${EVENTS_PORT}

NEXT_PUBLIC_POSTS_API_URL=http://localhost:${POSTS_PORT}

NEXT_PUBLIC_FETCH_API_URL=http://localhost:${FETCH_PORT}

"
create_env_file "frontend" "$FRONTEND_ENV"

# 2. Chat .env (рядки 1-9)
echo "2️⃣  Створення chat/.env..."
CHAT_ENV="PORT=${CHAT_PORT}

PG_NAME=${DB_NAME}
PG_USER=${DB_USER}
PG_PASSWORD=${DB_PASSWORD}
PG_HOST=${DB_HOST}
PG_PORT=${DB_PORT}
DB_TYPE=${DB_TYPE}
CLIENT_BASE_URL=${CLIENT_BASE_URL}
"
create_env_file "chat" "$CHAT_ENV"

# 3. DB .env (рядки 1-15)
echo "3️⃣  Створення db/.env..."
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

# 4. Events .env (рядки 1-10)
echo "4️⃣  Створення events/.env..."
EVENTS_ENV="PORT=${EVENTS_PORT}

PG_NAME=${DB_NAME}
PG_USER=${DB_USER}
PG_PASSWORD=${DB_PASSWORD}
PG_HOST=${DB_HOST}
PG_PORT=${DB_PORT}
DB_TYPE=${DB_TYPE}

FRONTEND_URL=${FRONTEND_URL}
"
create_env_file "events" "$EVENTS_ENV"

# 5. Fetch .env (рядки 1-6)
echo "5️⃣  Створення fetch/.env..."
FETCH_ENV="PORT=${FETCH_PORT}

FRONTEND_URL=${FRONTEND_URL}

CLICKHOUSE_URL=http://${CLICKHOUSE_USER}:${CLICKHOUSE_PASSWORD}@localhost:8123/${CLICKHOUSE_DB}
DB_NAME=${DB_NAME}_sync
"
create_env_file "fetch" "$FETCH_ENV"

# 6. Notifications .env (рядки 1-22)
echo "6️⃣  Створення notifications/.env..."
NOTIFICATIONS_ENV="PORT=${AUTH_PORT}

CLICKHOUSE_HOST=
CLICKHOUSE_USER=
CLICKHOUSE_PASSWORD=
CLICKHOUSE_DB=

JWT_ACCESS_SECRET=${JWT_ACCESS_SECRET}
JWT_RESRESH_SECRET=${JWT_REFRESH_SECRET}

PG_NAME=${DB_NAME}
PG_USER=${DB_USER}
PG_PASSWORD=${DB_PASSWORD}
PG_HOST=${DB_HOST}
PG_PORT=${DB_PORT}
DB_TYPE=${DB_TYPE}

REDIS_HOST=${REDIS_HOST}
REDIS_PORT=${REDIS_PORT}
REDIS_PASSWORD=${REDIS_PASSWORD}

CLIENT_BASE_URL=${CLIENT_BASE_URL}
"
create_env_file "notifications" "$NOTIFICATIONS_ENV"

# 7. Posts .env (рядки 1-10)
echo "7️⃣  Створення posts/.env..."
POSTS_ENV="PORT=${POSTS_PORT}

PG_NAME=${DB_NAME}
PG_USER=${DB_USER}
PG_PASSWORD=${DB_PASSWORD}
PG_HOST=${DB_HOST}
PG_PORT=${DB_PORT}
DB_TYPE=${DB_TYPE}

FRONTEND_URL=${FRONTEND_URL}
"
create_env_file "posts" "$POSTS_ENV"

# 8. Auth .env (якщо потрібно)
if [ -d "auth" ]; then
    echo "8️⃣  Створення auth/.env..."
    AUTH_ENV="PORT=${AUTH_PORT}

CLICKHOUSE_HOST=
CLICKHOUSE_USER=
CLICKHOUSE_PASSWORD=
CLICKHOUSE_DB=

JWT_ACCESS_SECRET=${JWT_ACCESS_SECRET}
JWT_RESRESH_SECRET=${JWT_REFRESH_SECRET}

PG_NAME=${DB_NAME}
PG_USER=${DB_USER}
PG_PASSWORD=${DB_PASSWORD}
PG_HOST=${DB_HOST}
PG_PORT=${DB_PORT}
DB_TYPE=${DB_TYPE}

REDIS_HOST=${REDIS_HOST}
REDIS_PORT=${REDIS_PORT}
REDIS_PASSWORD=${REDIS_PASSWORD}

CLIENT_BASE_URL=${CLIENT_BASE_URL}
"
    create_env_file "auth" "$AUTH_ENV"
fi

echo ""
echo "🎉 Всі .env файли створені успішно!"
echo ""
echo "📝 Створені файли:"
echo "   - frontend/.env"
echo "   - chat/.env"
echo "   - db/.env"
echo "   - events/.env"
echo "   - fetch/.env"
echo "   - notifications/.env"
echo "   - posts/.env"
[ -d "auth" ] && echo "   - auth/.env"
echo ""
echo "💡 Ви можете змінити значення в цих файлах за потреби"
echo "💡 Для production використовуйте сильніші паролі та секрети!"
echo ""
echo "📋 Налаштування можна змінити через змінні оточення перед запуском:"
echo "   export DB_PASSWORD=your_password"
echo "   export JWT_ACCESS_SECRET=your_secret"
echo "   ./setup-credentials.sh"

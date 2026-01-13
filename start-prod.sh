#!/bin/bash

# Скрипт для запуску всіх контейнерів ArtsApp у production режимі
# Використання: ./start-prod.sh

set -e

echo "🚀 Запуск ArtsApp у production режимі..."
echo ""

# Перевірка чи існує docker-compose.prod.yml
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Помилка: docker-compose.prod.yml не знайдено!"
    exit 1
fi

# Перевірка чи Docker запущений
if ! docker info > /dev/null 2>&1; then
    echo "❌ Помилка: Docker не запущений. Будь ласка, запустіть Docker і спробуйте знову."
    exit 1
fi

# Створення .env файлу якщо його немає
if [ ! -f ".env" ]; then
    echo "⚠️  Файл .env не знайдено. Створюємо з дефолтними значеннями..."
    cat > .env << 'EOF'
# База даних
PG_PASSWORD=1111
REDIS_PASSWORD=1111
CLICKHOUSE_USER=clickhouse
CLICKHOUSE_PASSWORD=1111
CLICKHOUSE_DB=clickhouse

# JWT секрети (ЗМІНІТЬ ЦІ ЗНАЧЕННЯ В PRODUCTION!)
JWT_ACCESS_SECRET=your-super-secret-access-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Public URLs для frontend
NEXT_PUBLIC_AUTH_URL=http://localhost:4000
NEXT_PUBLIC_CHAT_URL=http://localhost:4001
NEXT_PUBLIC_EVENTS_URL=http://localhost:4002
NEXT_PUBLIC_FETCH_URL=http://localhost:4003
NEXT_PUBLIC_POSTS_URL=http://localhost:4004
EOF
    echo "✅ Створено .env файл"
    echo ""
fi

# Зупинка старих контейнерів (якщо запущені)
echo "🛑 Зупинка старих контейнерів (якщо є)..."
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
echo ""

# Побудова образів
echo "🔨 Побудова Docker образів..."
docker-compose -f docker-compose.prod.yml build --no-cache
echo ""

# Запуск контейнерів у фоновому режимі
echo "🎯 Запуск контейнерів у фоновому режимі..."
docker-compose -f docker-compose.prod.yml up -d
echo ""

# Очікування на запуск баз даних
echo "⏳ Очікування на запуск баз даних..."
sleep 10

# Виведення статусу контейнерів
echo "📊 Статус контейнерів:"
docker-compose -f docker-compose.prod.yml ps
echo ""

# Перевірка здоров'я контейнерів
echo "🏥 Перевірка здоров'я сервісів..."
sleep 5

HEALTHY=true

check_service() {
    local service=$1
    local port=$2
    local name=$3
    
    if curl -s -f http://localhost:${port}/health > /dev/null 2>&1 || \
       curl -s -f http://localhost:${port} > /dev/null 2>&1; then
        echo "✅ ${name} (порт ${port}) - працює"
    else
        echo "⚠️  ${name} (порт ${port}) - можливо ще запускається..."
        HEALTHY=false
    fi
}

# Перевірка баз даних
if docker exec artsapp-postgres-prod pg_isready -U postgres > /dev/null 2>&1; then
    echo "✅ PostgreSQL - працює"
else
    echo "⚠️  PostgreSQL - можливо ще запускається..."
    HEALTHY=false
fi

if docker exec artsapp-redis-prod redis-cli -a 1111 ping > /dev/null 2>&1; then
    echo "✅ Redis - працює"
else
    echo "⚠️  Redis - можливо ще запускається..."
    HEALTHY=false
fi

if curl -s http://localhost:8123/ping > /dev/null 2>&1; then
    echo "✅ ClickHouse - працює"
else
    echo "⚠️  ClickHouse - можливо ще запускається..."
    HEALTHY=false
fi

# Перевірка мікросервісів
check_service "auth-service" "4000" "Auth Service"
check_service "chat-service" "4001" "Chat Service"
check_service "events-service" "4002" "Events Service"
check_service "fetch-service" "4003" "Fetch Service"
check_service "posts-service" "4004" "Posts Service"
check_service "frontend" "3000" "Frontend"

echo ""
echo "✨ Запуск завершено!"
echo ""
echo "📝 Корисні команди:"
echo "  Переглянути логи всіх сервісів:    docker-compose -f docker-compose.prod.yml logs -f"
echo "  Переглянути логи одного сервісу:   docker-compose -f docker-compose.prod.yml logs -f [service-name]"
echo "  Статус контейнерів:                docker-compose -f docker-compose.prod.yml ps"
echo "  Зупинити всі контейнери:           docker-compose -f docker-compose.prod.yml down"
echo "  Зупинити і видалити volumes:       docker-compose -f docker-compose.prod.yml down -v"
echo ""
echo "🌐 Сервіси доступні за адресами:"
echo "  Frontend:       http://localhost:3000"
echo "  Auth Service:   http://localhost:4000"
echo "  Chat Service:   http://localhost:4001"
echo "  Events Service: http://localhost:4002"
echo "  Fetch Service:  http://localhost:4003"
echo "  Posts Service:  http://localhost:4004"
echo ""

if [ "$HEALTHY" = false ]; then
    echo "⚠️  Деякі сервіси ще запускаються. Почекайте 30-60 секунд і перевірте логи:"
    echo "   docker-compose -f docker-compose.prod.yml logs -f"
fi



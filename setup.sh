#!/bin/bash
set -e  # Зупинити при помилці

echo "🚀 Запуск всіх сервісів з нуля..."

# Функція для перевірки, чи порт вільний
check_port() {
    local port=$1
    # Перевірка через lsof (якщо доступний)
    if command -v lsof >/dev/null 2>&1; then
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
            echo "⚠️  Порт $port вже зайнятий"
            return 1
        fi
    fi
    # Перевірка через netstat (якщо доступний)
    if command -v netstat >/dev/null 2>&1; then
        if netstat -an | grep -q ":$port.*LISTEN" 2>/dev/null; then
            echo "⚠️  Порт $port вже зайнятий"
            return 1
        fi
    fi
    return 0
}

# Функція для зупинки та видалення контейнера
stop_and_remove_container() {
    local container_name=$1
    if docker ps -a --format '{{.Names}}' | grep -q "^${container_name}$"; then
        echo "🛑 Зупинка контейнера $container_name..."
        docker stop "$container_name" 2>/dev/null || true
        echo "🗑️  Видалення контейнера $container_name..."
        docker rm "$container_name" 2>/dev/null || true
    fi
}

# Очистка старих контейнерів (якщо є)
echo "📦 Видалення старих контейнерів..."
stop_and_remove_container postgres
stop_and_remove_container clickhouse
stop_and_remove_container redis
stop_and_remove_container rabbitmq

# 1. Redis
echo "1️⃣  Запуск Redis..."
if ! check_port 6379; then
    echo "❌ Порт 6379 зайнятий. Перевірте, чи не запущений інший Redis контейнер або процес."
    echo "   Спробуйте: docker ps | grep redis"
    exit 1
fi
docker run --name redis -d -p 6379:6379 redis redis-server --requirepass "1111"

# 2. PostgreSQL (з логічною реплікацією!)
echo "2️⃣  Запуск PostgreSQL з логічною реплікацією..."
if ! check_port 5434; then
    echo "❌ Порт 5434 зайнятий. Перевірте, чи не запущений інший PostgreSQL контейнер або процес."
    echo "   Спробуйте: docker ps | grep postgres"
    exit 1
fi
# Хост-порт 5434 (щоб не конфліктувати з локальним PostgreSQL на 5432),
# всередині контейнера PostgreSQL слухає на стандартному 5432.
docker run --name postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=1111 \
  -e POSTGRES_DB=artsapp \
  -p 5434:5432 -d postgres \
  -c wal_level=logical \
  -c max_replication_slots=10 \
  -c max_wal_senders=10

# 3. ClickHouse
echo "3️⃣  Запуск ClickHouse..."
if ! check_port 8123 || ! check_port 9000; then
    echo "❌ Порти 8123 або 9000 зайняті. Перевірте, чи не запущений інший ClickHouse контейнер або процес."
    echo "   Спробуйте: docker ps | grep clickhouse"
    exit 1
fi
docker run --name clickhouse -d \
  -e CLICKHOUSE_DB=clickhouse \
  -e CLICKHOUSE_USER=clickhouse \
  -e CLICKHOUSE_DEFAULT_ACCESS_MANAGEMENT=1 \
  -e CLICKHOUSE_PASSWORD=1111 \
  -p 8123:8123 -p 9000:9000 \
  clickhouse/clickhouse-server

# 4. RabbitMQ
echo "4️⃣  Запуск RabbitMQ..."
if ! check_port 5672 || ! check_port 15672; then
    echo "❌ Порти 5672 або 15672 зайняті. Перевірте, чи не запущений інший RabbitMQ контейнер або процес."
    echo "   Спробуйте: docker ps | grep rabbitmq"
    exit 1
fi
docker run -d --name rabbitmq \
  -e RABBITMQ_DEFAULT_USER=admin \
  -e RABBITMQ_DEFAULT_PASS=1111 \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:4-management

# 5. Очікування готовності RabbitMQ
echo "5️⃣  Очікування готовності RabbitMQ (15 секунд)..."
for i in {1..15}; do
  if docker exec rabbitmq rabbitmqctl status >/dev/null 2>&1; then
    echo "✅ RabbitMQ готовий!"
    break
  fi
  sleep 1
done

# 6. Очікування готовності PostgreSQL
echo "6️⃣  Очікування готовності PostgreSQL (30 секунд)..."
for i in {1..30}; do
  if docker exec postgres pg_isready -U postgres >/dev/null 2>&1; then
    echo "✅ PostgreSQL готовий!"
    break
  fi
  sleep 1
done


# 7. Перевірка wal_level
echo "7️⃣  Перевірка wal_level..."
WAL_LEVEL=$(docker exec postgres psql -U postgres -t -c "SHOW wal_level;" | tr -d ' ')
if [ "$WAL_LEVEL" != "logical" ]; then
  echo "❌ Помилка: wal_level = $WAL_LEVEL (має бути logical)"
  exit 1
fi
echo "✅ wal_level = logical"

# 8. Міграції
echo "8️⃣  Запуск міграцій PostgreSQL..."
cd "$(dirname "$0")/db" 2>/dev/null || cd db 2>/dev/null || true
if [ -f "package.json" ]; then
  npm install >/dev/null 2>&1 || true
  npm run migrations:run || echo "⚠️  Міграції вже виконані або помилка"
else
  echo "⚠️  package.json не знайдено, виконую міграції вручну..."
  cd "$(dirname "$0")" || true
  docker exec -i postgres psql -U postgres -d artsapp < db/migrations/1_create_user_table.sql 2>/dev/null || true
  docker exec -i postgres psql -U postgres -d artsapp < db/migrations/2_create_topic_table.sql 2>/dev/null || true
  docker exec -i postgres psql -U postgres -d artsapp < db/migrations/3_create_message_table.sql 2>/dev/null || true
  docker exec -i postgres psql -U postgres -d artsapp < db/migrations/4_create_topic_read.sql 2>/dev/null || true
  docker exec -i postgres psql -U postgres -d artsapp < db/migrations/5_message_reads_table.sql 2>/dev/null || true
  docker exec -i postgres psql -U postgres -d artsapp < db/migrations/6_create_events_table.sql 2>/dev/null || true
  docker exec -i postgres psql -U postgres -d artsapp < db/migrations/7_create_posts_table.sql 2>/dev/null || true
fi

# 9. Перевірка таблиць
echo "9️⃣  Перевірка таблиць в PostgreSQL..."
TABLES_COUNT=$(docker exec postgres psql -U postgres -d artsapp -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name NOT LIKE 'pg_%';" | tr -d ' ')
echo "✅ Знайдено таблиць: $TABLES_COUNT"
if [ "$TABLES_COUNT" = "0" ]; then
  echo "❌ Помилка: міграції не створили таблиці в PostgreSQL."
  echo "   ClickHouse не зможе реплікувати неіснуючі таблиці."
  echo "   Перевірте крок 8️⃣ (npm run migrations:run) та підключення з хоста на localhost:5432."
  exit 1
fi

# 10. Створення публікації
echo "🔟 Створення публікації..."
docker exec postgres psql -U postgres -d artsapp -c \
  "CREATE PUBLICATION IF NOT EXISTS clickhouse_publication FOR ALL TABLES;" 2>/dev/null || \
docker exec postgres psql -U postgres -d artsapp -c \
  "CREATE PUBLICATION clickhouse_publication FOR ALL TABLES;"

# 11. Отримання IP PostgreSQL
echo "1️⃣1️⃣  Отримання IP адреси PostgreSQL..."
PG_IP=$(docker inspect postgres -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}')
if [ -z "$PG_IP" ]; then
  echo "❌ Помилка: не вдалося отримати IP адресу PostgreSQL"
  exit 1
fi
echo "✅ PostgreSQL IP: $PG_IP"

# 12. Очікування готовності ClickHouse
echo "1️⃣2️⃣  Очікування готовності ClickHouse (10 секунд)..."
sleep 10

# 13. Створення реплікації в ClickHouse
echo "1️⃣3️⃣  Створення MaterializedPostgreSQL бази в ClickHouse..."
# ClickHouse ходить до PostgreSQL контейнер-до-контейнера за внутрішнім IP,
# тому порт ВНУТРІШНІЙ (5432), а не опублікований host-порт 5434.
docker exec clickhouse clickhouse-client --query "
SET allow_experimental_database_materialized_postgresql = 1;
DROP DATABASE IF EXISTS postgres_clickhouse1;
DROP DATABASE IF EXISTS postgres_clickhouse11;
DROP DATABASE IF EXISTS artsapp_sync;
CREATE DATABASE artsapp_sync
ENGINE = MaterializedPostgreSQL('$PG_IP:5432', 'artsapp', 'postgres', '1111')
SETTINGS 
    materialized_postgresql_schema = 'public',
    materialized_postgresql_tables_list = 'users,topics,messages,topic_reads,message_reads,events,posts';" 2>&1

# 14. Очікування синхронізації
echo "1️⃣4️⃣  Очікування синхронізації (10 секунд)..."
sleep 10

# 15. Перевірка таблиць в ClickHouse
echo "1️⃣5️⃣  Перевірка таблиць в ClickHouse..."
TABLES=$(docker exec clickhouse clickhouse-client --query "SHOW TABLES FROM artsapp_sync;" 2>/dev/null || echo "")
if [ -z "$TABLES" ]; then
  echo "⚠️  Таблиці ще не з'явилися, чекаю ще 10 секунд..."
  sleep 10
  TABLES=$(docker exec clickhouse clickhouse-client --query "SHOW TABLES FROM artsapp_sync;" 2>/dev/null || echo "")
fi

if [ -z "$TABLES" ]; then
  echo "❌ Помилка: таблиці не з'явилися в ClickHouse"
  echo "📋 Діагностика:"
  docker exec clickhouse clickhouse-client --query "SELECT * FROM system.errors ORDER BY last_error_time DESC LIMIT 5;" 2>/dev/null || true
  exit 1
fi

echo "✅ Таблиці в ClickHouse:"
echo "$TABLES"

# 16. Фінальна перевірка
echo "1️⃣6️⃣  Фінальна перевірка..."
echo "📊 Статистика таблиць:"
docker exec clickhouse clickhouse-client --query "
SELECT 
    table,
    count() as rows
FROM (
    SELECT 'users' as table FROM artsapp_sync.users
    UNION ALL SELECT 'topics' FROM artsapp_sync.topics
    UNION ALL SELECT 'messages' FROM artsapp_sync.messages
    UNION ALL SELECT 'topic_reads' FROM artsapp_sync.topic_reads
    UNION ALL SELECT 'message_reads' FROM artsapp_sync.message_reads
    UNION ALL SELECT 'events' FROM artsapp_sync.events
    UNION ALL SELECT 'posts' FROM artsapp_sync.posts
) GROUP BY table
FORMAT PrettyCompact;" 2>/dev/null || echo "Таблиці порожні (це нормально якщо немає даних)"

echo ""
echo "🎉 ВСЕ ГОТОВО! Реплікація налаштована успішно!"
echo ""
echo "📝 Корисні команди:"
echo "   - Перевірка таблиць: docker exec clickhouse clickhouse-client --query 'SHOW TABLES FROM artsapp_sync;'"
echo "   - Підключення до PostgreSQL: docker exec -it postgres psql -U postgres -d artsapp"
echo "   - Підключення до ClickHouse: docker exec -it clickhouse clickhouse-client"
echo "   - RabbitMQ Management UI: http://localhost:15672 (admin/1111)"
echo "   - Перевірка RabbitMQ: docker exec rabbitmq rabbitmqctl status"
echo ""
echo "💡 Наступний крок: Запустіть ./setup-credentials.sh для налаштування .env файлів"
echo ""
echo "📌 Нова структура проекту:"
echo "   - backend: об'єднаний сервіс (auth, chat, events, fetch, posts)"
echo "   - frontend: Next.js додаток"
echo "   - notifications: окремий мікросервіс для сповіщень"

docker exec clickhouse clickhouse-client --query "SELECT * from artsapp_sync.events;"






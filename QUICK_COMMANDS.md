# 🚀 Швидкі команди для artsapp

## Запуск з нуля (повний скрипт)

```bash
#!/bin/bash
set -e  # Зупинити при помилці

echo "🚀 Запуск всіх сервісів з нуля..."

# Очистка старих контейнерів (якщо є)
echo "📦 Видалення старих контейнерів..."
docker rm -f postgres clickhouse redis 2>/dev/null || true

# 1. Redis
echo "1️⃣  Запуск Redis..."
docker run --name redis -d -p 6379:6379 redis redis-server --requirepass "1111"

# 2. PostgreSQL (з логічною реплікацією!)
echo "2️⃣  Запуск PostgreSQL з логічною реплікацією..."
docker run --name postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=1111 \
  -e POSTGRES_DB=artsapp \
  -p 5434:5434 -d postgres \
  -c wal_level=logical \
  -c max_replication_slots=10 \
  -c max_wal_senders=10

# 3. ClickHouse
echo "3️⃣  Запуск ClickHouse..."
docker run --name clickhouse -d \
  -e CLICKHOUSE_DB=clickhouse \
  -e CLICKHOUSE_USER=clickhouse \
  -e CLICKHOUSE_DEFAULT_ACCESS_MANAGEMENT=1 \
  -e CLICKHOUSE_PASSWORD=1111 \
  -p 8123:8123 -p 9000:9000 \
  clickhouse/clickhouse-server

# 4. Очікування готовності PostgreSQL
echo "4️⃣  Очікування готовності PostgreSQL (30 секунд)..."
for i in {1..30}; do
  if docker exec postgres pg_isready -U postgres >/dev/null 2>&1; then
    echo "✅ PostgreSQL готовий!"
    break
  fi
  sleep 1
done

# 5. Перевірка wal_level
echo "5️⃣  Перевірка wal_level..."
WAL_LEVEL=$(docker exec postgres psql -U postgres -t -c "SHOW wal_level;" | tr -d ' ')
if [ "$WAL_LEVEL" != "logical" ]; then
  echo "❌ Помилка: wal_level = $WAL_LEVEL (має бути logical)"
  exit 1
fi
echo "✅ wal_level = logical"

# 6. Міграції
echo "6️⃣  Запуск міграцій PostgreSQL..."
cd "$(dirname "$0")/db" || cd db
if [ ! -f "package.json" ]; then
  echo "⚠️  package.json не знайдено, виконую міграції вручну..."
  docker exec -i postgres psql -U postgres -d artsapp < migrations/1_create_user_table.sql 2>/dev/null || true
  docker exec -i postgres psql -U postgres -d artsapp < migrations/2_create_topic_table.sql 2>/dev/null || true
  docker exec -i postgres psql -U postgres -d artsapp < migrations/3_create_message_table.sql 2>/dev/null || true
  docker exec -i postgres psql -U postgres -d artsapp < migrations/4_create_topic_read.sql 2>/dev/null || true
  docker exec -i postgres psql -U postgres -d artsapp < migrations/5_message_reads_table.sql 2>/dev/null || true
else
  npm install >/dev/null 2>&1 || true
  npm run migrations:run || echo "⚠️  Міграції вже виконані або помилка"
fi

# 7. Перевірка таблиць
echo "7️⃣  Перевірка таблиць в PostgreSQL..."
TABLES_COUNT=$(docker exec postgres psql -U postgres -d artsapp -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name NOT LIKE 'pg_%';" | tr -d ' ')
echo "✅ Знайдено таблиць: $TABLES_COUNT"

# 8. Створення публікації
echo "8️⃣  Створення публікації..."
docker exec postgres psql -U postgres -d artsapp -c \
  "CREATE PUBLICATION IF NOT EXISTS clickhouse_publication FOR ALL TABLES;" 2>/dev/null || \
docker exec postgres psql -U postgres -d artsapp -c \
  "CREATE PUBLICATION clickhouse_publication FOR ALL TABLES;"

# 9. Отримання IP PostgreSQL
echo "9️⃣  Отримання IP адреси PostgreSQL..."
PG_IP=$(docker inspect postgres -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}')
if [ -z "$PG_IP" ]; then
  echo "❌ Помилка: не вдалося отримати IP адресу PostgreSQL"
  exit 1
fi
echo "✅ PostgreSQL IP: $PG_IP"

# 10. Очікування готовності ClickHouse
echo "🔟 Очікування готовності ClickHouse (10 секунд)..."
sleep 10

# 11. Створення реплікації в ClickHouse
echo "1️⃣1️⃣  Створення MaterializedPostgreSQL бази в ClickHouse..."
docker exec clickhouse clickhouse-client --query "
SET allow_experimental_database_materialized_postgresql = 1;
DROP DATABASE IF EXISTS artsapp_sync;
CREATE DATABASE artsapp_sync
ENGINE = MaterializedPostgreSQL('$PG_IP:5434', 'artsapp', 'postgres', '1111')
SETTINGS
    materialized_postgresql_schema = 'public',
    materialized_postgresql_tables_list = 'users,topics,messages,topic_reads,message_reads';" 2>&1

# 12. Очікування синхронізації
echo "1️⃣2️⃣  Очікування синхронізації (10 секунд)..."
sleep 10

# 13. Перевірка таблиць в ClickHouse
echo "1️⃣3️⃣  Перевірка таблиць в ClickHouse..."
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

# 14. Фінальна перевірка
echo "1️⃣4️⃣  Фінальна перевірка..."
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
) GROUP BY table
FORMAT PrettyCompact;" 2>/dev/null || echo "Таблиці порожні (це нормально якщо немає даних)"

echo ""
echo "🎉 ВСЕ ГОТОВО! Реплікація налаштована успішно!"
echo ""
echo "📝 Корисні команди:"
echo "   - Перевірка таблиць: docker exec clickhouse clickhouse-client --query 'SHOW TABLES FROM artsapp_sync;'"
echo "   - Підключення до PostgreSQL: docker exec -it postgres psql -U postgres -d artsapp"
echo "   - Підключення до ClickHouse: docker exec -it clickhouse clickhouse-client"
```

## Швидкий запуск (одна команда)

```bash
# З кореневої директорії проєкту:
chmod +x setup.sh && ./setup.sh
```

## Коротка версія (для ручного виконання)

```bash
# 1. Запуск контейнерів
docker rm -f postgres clickhouse redis 2>/dev/null || true
docker run --name redis -d -p 6379:6379 redis redis-server --requirepass "1111"
docker run --name postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=1111 -e POSTGRES_DB=artsapp -p 5434:5434 -d postgres -c wal_level=logical -c max_replication_slots=10 -c max_wal_senders=10
docker run --name clickhouse -d -e CLICKHOUSE_DB=clickhouse -e CLICKHOUSE_USER=clickhouse -e CLICKHOUSE_DEFAULT_ACCESS_MANAGEMENT=1 -e CLICKHOUSE_PASSWORD=1111 -p 8123:8123 -p 9000:9000 clickhouse/clickhouse-server

# 2. Очікування готовності (30 секунд)
sleep 30

# 3. Міграції
cd db && npm run migrations:run

# 4. Публікація
docker exec postgres psql -U postgres -d artsapp -c "CREATE PUBLICATION IF NOT EXISTS clickhouse_publication FOR ALL TABLES;"

# 5. Отримання IP та створення реплікації
PG_IP=$(docker inspect postgres -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}')
docker exec clickhouse clickhouse-client --query "SET allow_experimental_database_materialized_postgresql = 1; DROP DATABASE IF EXISTS artsapp_sync; CREATE DATABASE artsapp_sync ENGINE = MaterializedPostgreSQL('$PG_IP:5434', 'artsapp', 'postgres', '1111') SETTINGS materialized_postgresql_schema = 'public', materialized_postgresql_tables_list = 'users,topics,messages,topic_reads,message_reads';"

# 6. Перевірка (через 10 секунд)
sleep 10
docker exec clickhouse clickhouse-client --query "SHOW TABLES FROM artsapp_sync;"
```

## Перезапуск PostgreSQL (якщо забули wal_level)

```bash
# Зупинити і видалити
docker stop postgres && docker rm postgres

# Запустити з правильними параметрами
docker run --name postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=1111 \
  -e POSTGRES_DB=artsapp \
  -p 5434:5434 -d postgres \
  -c wal_level=logical \
  -c max_replication_slots=10 \
  -c max_wal_senders=10

# Запустити міграції заново
cd db && npm run migrations:run
```

## Перевірка налаштувань

```bash
# PostgreSQL wal_level (має бути: logical)
docker exec postgres psql -U postgres -c "SHOW wal_level;"

# Таблиці в PostgreSQL
docker exec postgres psql -U postgres -d artsapp -c "\dt"

# Публікації
docker exec postgres psql -U postgres -d artsapp -c "\dRp+"

# Таблиці в ClickHouse
docker exec clickhouse clickhouse-client --query "SHOW TABLES FROM artsapp_sync;"

# Кількість записів
docker exec clickhouse clickhouse-client --query "
SELECT 'users' as t, count() as c FROM artsapp_sync.users
UNION ALL SELECT 'topics', count() FROM artsapp_sync.topics
UNION ALL SELECT 'messages', count() FROM artsapp_sync.messages;"
```

## Тест реплікації

```bash
# Додати користувача в PostgreSQL
docker exec postgres psql -U postgres -d artsapp -c "
INSERT INTO users (full_name, email, pass, occupation)
VALUES ('Test User', 'test@test.com', 'pass123', 'Tester')
RETURNING *;"

# Перевірити в ClickHouse (через 1-2 секунди)
docker exec clickhouse clickhouse-client --query "
SELECT * FROM artsapp_sync.users WHERE email = 'test@test.com';"
```

## Підключення до баз даних

```bash
# PostgreSQL
docker exec -it postgres psql -U postgres -d artsapp

# ClickHouse
docker exec -it clickhouse clickhouse-client

# Redis
docker exec -it redis redis-cli
# AUTH 1111
```

## Логи

```bash
# Всі логи разом
docker logs -f postgres & docker logs -f clickhouse & docker logs -f redis

# Окремо
docker logs -f postgres
docker logs -f clickhouse
docker logs -f redis
```

## Зупинка/видалення

```bash
# Зупинити
docker stop postgres clickhouse redis

# Видалити (УВАГА: видалить всі дані!)
docker rm -f postgres clickhouse redis

# Видалити volumes теж
docker volume prune -f
```

## Діагностика проблем реплікації

```bash
# Помилки в ClickHouse
docker exec clickhouse clickhouse-client --query "
SELECT name, last_error_message, last_error_time
FROM system.errors
ORDER BY last_error_time DESC
LIMIT 10;"

# Слоти реплікації в PostgreSQL
docker exec postgres psql -U postgres -d artsapp -c "
SELECT slot_name, plugin, active, restart_lsn
FROM pg_replication_slots;"

# Статус реплікації
docker exec postgres psql -U postgres -d artsapp -c "
SELECT * FROM pg_stat_replication;"

# IP адреси контейнерів
docker inspect postgres -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'
docker inspect clickhouse -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'
```

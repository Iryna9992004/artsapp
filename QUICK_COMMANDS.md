# 🚀 Швидкі команди для artsapp

## Запуск з нуля

```bash
# 1. Redis
docker run --name redis -d -p 6379:6379 redis redis-server --requirepass "1111"

# 2. PostgreSQL (з логічною реплікацією!)
docker run --name postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=1111 \
  -e POSTGRES_DB=artsapp \
  -p 5432:5432 -d postgres \
  -c wal_level=logical \
  -c max_replication_slots=10 \
  -c max_wal_senders=10

# 3. ClickHouse
docker run --name clickhouse -d \
  -e CLICKHOUSE_DB=clickhouse \
  -e CLICKHOUSE_USER=clickhouse \
  -e CLICKHOUSE_DEFAULT_ACCESS_MANAGEMENT=1 \
  -e CLICKHOUSE_PASSWORD=1111 \
  -p 8123:8123 -p 9000:9000 \
  clickhouse/clickhouse-server

# 4. Міграції (через 10 секунд після запуску PostgreSQL)
sleep 10
cd db && npm run migrations:run

# 5. Публікація
docker exec postgres psql -U postgres -d artsapp -c \
  "CREATE PUBLICATION clickhouse_publication FOR ALL TABLES;"

# 6. Отримайте IP PostgreSQL
PG_IP=$(docker inspect postgres -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}')
echo "PostgreSQL IP: $PG_IP"

# 7. Створіть реплікацію в ClickHouse
docker exec clickhouse clickhouse-client --query "
SET allow_experimental_database_materialized_postgresql = 1;
CREATE DATABASE artsapp_sync
ENGINE = MaterializedPostgreSQL('$PG_IP:5432', 'artsapp', 'postgres', '1111')
SETTINGS 
    materialized_postgresql_schema = 'public',
    materialized_postgresql_tables_list = 'users,topics,messages,topic_reads,message_reads';"

# 8. Перевірка (через 5 секунд)
sleep 5
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
  -p 5432:5432 -d postgres \
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
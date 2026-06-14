#!/bin/bash

# Скрипт для швидкого налаштування реплікації PostgreSQL → ClickHouse

set -e

echo "🚀 Налаштування реплікації PostgreSQL → ClickHouse"
echo "=================================================="

# Перейти в директорію db
cd "$(dirname "$0")/.."

echo ""
echo "1️⃣  Зупинка існуючих контейнерів..."
docker-compose down -v

echo ""
echo "2️⃣  Запуск нових сервісів (PostgreSQL + ClickHouse + Redis)..."
docker-compose up -d

echo ""
echo "3️⃣  Очікування ініціалізації PostgreSQL (30 секунд)..."
sleep 30

echo ""
echo "4️⃣  Перевірка статусу PostgreSQL..."
docker exec postgres_db pg_isready -U postgres

echo ""
echo "5️⃣  Перевірка таблиць у PostgreSQL..."
docker exec -it postgres_db psql -U postgres -d artsapp -c "\dt"

echo ""
echo "6️⃣  Перевірка публікацій у PostgreSQL..."
docker exec -it postgres_db psql -U postgres -d artsapp -c "\dRp+"

echo ""
echo "7️⃣  Створення MaterializedPostgreSQL бази в ClickHouse..."
docker exec -it clickhouse clickhouse-client --query "
DROP DATABASE IF EXISTS postgres_clickhouse1;
DROP DATABASE IF EXISTS postgres_clickhouse11;
DROP DATABASE IF EXISTS artsapp_sync;

CREATE DATABASE artsapp_sync
ENGINE = MaterializedPostgreSQL('postgres:5434', 'artsapp', 'postgres', '1111')
SETTINGS 
    materialized_postgresql_schema = 'public',
    materialized_postgresql_tables_list = 'users,topics,messages,topic_reads,message_reads';
"

echo ""
echo "8️⃣  Очікування синхронізації (10 секунд)..."
sleep 10

echo ""
echo "9️⃣  Перевірка таблиць у ClickHouse..."
docker exec -it clickhouse clickhouse-client --query "SHOW TABLES FROM artsapp_sync;"

echo ""
echo "🔟 Перевірка кількості записів..."
docker exec -it clickhouse clickhouse-client --query "
SELECT 'users' as table, count() as count FROM artsapp_sync.users
UNION ALL
SELECT 'topics' as table, count() as count FROM artsapp_sync.topics
UNION ALL
SELECT 'messages' as table, count() as count FROM artsapp_sync.messages;
"

echo ""
echo "✅ Налаштування завершено!"
echo ""
echo "📝 Корисні команди:"
echo "   - Логи PostgreSQL: docker logs -f postgres_db"
echo "   - Логи ClickHouse: docker logs -f clickhouse"
echo "   - PostgreSQL CLI:  docker exec -it postgres_db psql -U postgres -d artsapp"
echo "   - ClickHouse CLI:  docker exec -it clickhouse clickhouse-client"
echo ""
echo "📖 Детальна документація: db/REPLICATION_SETUP.md"








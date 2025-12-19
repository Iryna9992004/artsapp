-- Setup ClickHouse MaterializedPostgreSQL Database
-- Run this script after PostgreSQL is properly configured with logical replication

-- ============================================
-- ВАЖЛИВО: Замініть IP адресу PostgreSQL!
-- ============================================
-- Щоб знайти IP адресу:
--   docker inspect postgres -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'
-- Приклад виводу: 172.17.0.3
--
-- Або якщо обидва контейнери в одній Docker Compose мережі, використовуйте ім'я контейнера:
--   'postgres:5432' замість '172.17.0.3:5432'

-- Enable experimental feature
SET allow_experimental_database_materialized_postgresql = 1;

-- Drop old databases if they exist
DROP DATABASE IF EXISTS postgres_clickhouse1;
DROP DATABASE IF EXISTS postgres_clickhouse11;
DROP DATABASE IF EXISTS artsapp_sync;

-- Create new database with MaterializedPostgreSQL engine
-- ⚠️  ЗАМІНІТЬ 172.17.0.3 НА ВАШУ IP АДРЕСУ POSTGRESQL! ⚠️
CREATE DATABASE artsapp_sync
ENGINE = MaterializedPostgreSQL('172.17.0.3:5432', 'artsapp', 'postgres', '1111')
SETTINGS 
    materialized_postgresql_schema = 'public',
    materialized_postgresql_tables_list = 'users,topics,messages,topic_reads,message_reads';

-- Wait 5-10 seconds for initial sync, then verify:
-- SHOW TABLES FROM artsapp_sync;
-- 
-- SELECT 'users' as table, count() as count FROM artsapp_sync.users
-- UNION ALL SELECT 'topics', count() FROM artsapp_sync.topics  
-- UNION ALL SELECT 'messages', count() FROM artsapp_sync.messages;
--
-- Check replication status:
-- SELECT * FROM system.databases WHERE name = 'artsapp_sync';


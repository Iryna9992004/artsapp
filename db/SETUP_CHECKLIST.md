# ✅ Чек-лист налаштування реплікації PostgreSQL → ClickHouse

## Перевірка перед налаштуванням

- [ ] Docker встановлений і запущений
- [ ] Порти 5434, 6379, 8123, 9000 вільні
- [ ] Node.js встановлений (для міграцій)

## Крок 1: Запуск контейнерів ✅

```bash
# Redis
docker run --name redis -d -p 6379:6379 redis redis-server --requirepass "1111"

# PostgreSQL (ВАЖЛИВО: з wal_level=logical!)
docker run --name postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=1111 \
  -e POSTGRES_DB=artsapp \
  -p 5434:5434 -d postgres \
  -c wal_level=logical \
  -c max_replication_slots=10 \
  -c max_wal_senders=10

# ClickHouse
docker run --name clickhouse -d \
  -e CLICKHOUSE_DB=clickhouse \
  -e CLICKHOUSE_USER=clickhouse \
  -e CLICKHOUSE_DEFAULT_ACCESS_MANAGEMENT=1 \
  -e CLICKHOUSE_PASSWORD=1111 \
  -p 8123:8123 -p 9000:9000 \
  clickhouse/clickhouse-server
```

**Перевірка:**
```bash
docker ps | grep -E "postgres|clickhouse|redis"
# Має показати всі 3 контейнери у статусі "Up"
```

- [ ] Всі 3 контейнери запущені

## Крок 2: Перевірка PostgreSQL ✅

```bash
# Перевірка wal_level
docker exec postgres psql -U postgres -c "SHOW wal_level;"
# Має показати: logical (НЕ replica!)
```

- [ ] `wal_level = logical` ✓

## Крок 3: Міграції ✅

```bash
cd db
npm install
npm run migrations:run
```

**Перевірка:**
```bash
docker exec postgres psql -U postgres -d artsapp -c "\dt"
# Має показати 6 таблиць: users, topics, messages, topic_reads, message_reads, migrations
```

- [ ] Міграції виконані
- [ ] Всі 6 таблиць створені

## Крок 4: Публікація ✅

```bash
docker exec postgres psql -U postgres -d artsapp -c \
  "CREATE PUBLICATION clickhouse_publication FOR ALL TABLES;"
```

**Перевірка:**
```bash
docker exec postgres psql -U postgres -d artsapp -c "\dRp+"
docker exec postgres psql -U postgres -d artsapp -c "SELECT * FROM pg_publication_tables;"
# Має показати всі таблиці в публікації
```

- [ ] Публікація створена
- [ ] Всі таблиці включені в публікацію

## Крок 5: IP адреса PostgreSQL ✅

```bash
docker inspect postgres -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'
# Запам'ятайте цю IP адресу! (приклад: 172.17.0.3)
```

- [ ] IP адреса отримана: `__________________`

## Крок 6: Налаштування ClickHouse ✅

**Замініть `172.17.0.3` на вашу IP адресу з кроку 5!**

```bash
docker exec clickhouse clickhouse-client --query "
SET allow_experimental_database_materialized_postgresql = 1;
DROP DATABASE IF EXISTS postgres_clickhouse1;
DROP DATABASE IF EXISTS postgres_clickhouse11;
CREATE DATABASE artsapp_sync
ENGINE = MaterializedPostgreSQL('172.17.0.3:5434', 'artsapp', 'postgres', '1111')
SETTINGS 
    materialized_postgresql_schema = 'public',
    materialized_postgresql_tables_list = 'users,topics,messages,topic_reads,message_reads';"
```

- [ ] Команда виконана без помилок

## Крок 7: Перевірка реплікації ✅

```bash
# Почекайте 5-10 секунд, потім:
docker exec clickhouse clickhouse-client --query "SHOW TABLES FROM artsapp_sync;"
# Має показати 5 таблиць: users, topics, messages, topic_reads, message_reads
```

- [ ] Всі 5 таблиць з'явилися в ClickHouse

## Крок 8: Тест реплікації в реальному часі 🚀

```bash
# 1. Додайте тестового користувача в PostgreSQL:
docker exec postgres psql -U postgres -d artsapp -c "
INSERT INTO users (full_name, email, pass, occupation) 
VALUES ('Тестовий Користувач', 'test@example.com', 'password123', 'QA Engineer')
RETURNING id, full_name, email;"
```

**Запам'ятайте ID користувача!**

```bash
# 2. Через 1-2 секунди перевірте в ClickHouse:
docker exec clickhouse clickhouse-client --query "
SELECT id, full_name, email, occupation, created_at 
FROM artsapp_sync.users 
WHERE email = 'test@example.com';"
```

- [ ] Користувач з'явився в ClickHouse протягом 1-2 секунд ✓

**Якщо так - ВІТАЄМО! Реплікація працює! 🎉**

## Крок 9: Додаткові перевірки (опціонально)

### Перевірка слотів реплікації:
```bash
docker exec postgres psql -U postgres -d artsapp -c "
SELECT slot_name, plugin, slot_type, database, active 
FROM pg_replication_slots;"
# Має показати активний слот з plugin = 'pgoutput'
```

- [ ] Слот реплікації активний

### Перевірка помилок:
```bash
docker exec clickhouse clickhouse-client --query "
SELECT name, last_error_message, last_error_time 
FROM system.errors 
WHERE last_error_time > now() - INTERVAL 10 MINUTE
ORDER BY last_error_time DESC;"
# Не має показувати критичних помилок
```

- [ ] Немає критичних помилок

### Перевірка статистики:
```bash
docker exec clickhouse clickhouse-client --query "
SELECT 
    table,
    total_rows,
    formatReadableSize(total_bytes) as size
FROM system.tables 
WHERE database = 'artsapp_sync'
FORMAT PrettyCompact;"
```

- [ ] Статистика коректна

## Фінальний статус

**Дата налаштування:** `__________________`

**Версії:**
- PostgreSQL: `docker exec postgres psql --version`
- ClickHouse: `docker exec clickhouse clickhouse-client --version`

**Конфігурація:**
- PostgreSQL IP: `__________________`
- PostgreSQL Port: `5434`
- ClickHouse Ports: `8123` (HTTP), `9000` (Native)
- База даних: `artsapp`
- Реплікована база: `artsapp_sync`

**Реплікуються таблиці:**
1. ✅ users
2. ✅ topics
3. ✅ messages
4. ✅ topic_reads
5. ✅ message_reads

**Статус:** 
- [ ] ✅ ВСЕ ПРАЦЮЄ!
- [ ] ⚠️  Потрібна діагностика (див. README.md розділ "Діагностика проблем")

## Корисні посилання

- 📖 [Повна документація](../README.md)
- 🚀 [Швидкі команди](../QUICK_COMMANDS.md)
- 📊 [ClickHouse MaterializedPostgreSQL](https://clickhouse.com/docs/en/engines/database-engines/materialized-postgresql)
- 🔧 [PostgreSQL Logical Replication](https://www.postgresql.org/docs/current/logical-replication.html)

---

**Підказка:** Збережіть цей чек-лист для майбутніх налаштувань!








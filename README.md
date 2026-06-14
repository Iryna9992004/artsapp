# artsapp

Мікросервісна архітектура з PostgreSQL, ClickHouse та Redis.

## 📋 Загальна інформація

**Структура проєкту:**
- `auth/` - сервіс автентифікації
- `chat/` - сервіс чатів та повідомлень
- `frontend/` - Next.js додаток
- `db/` - міграції бази даних

**Технології:**
- PostgreSQL - основна база даних
- ClickHouse - аналітична база даних (реплікація з PostgreSQL)
- Redis - кеш та сесії

---

## 🚀 Швидкий старт

### ⚡ Автоматичне налаштування (РЕКОМЕНДОВАНО)

```bash
# З кореневої директорії проєкту:
chmod +x setup.sh && ./setup.sh
```

Цей скрипт автоматично:
- ✅ Запустить всі контейнери (Redis, PostgreSQL, ClickHouse)
- ✅ Налаштує PostgreSQL з логічною реплікацією
- ✅ Запустить міграції
- ✅ Створить публікацію
- ✅ Налаштує реплікацію в ClickHouse
- ✅ Перевірить що все працює

**Альтернатива:** Детальні покрокові інструкції нижче ⬇️

---

### 1. Запуск Redis через Docker

```bash
docker run --name redis -d -p 6379:6379 redis redis-server --requirepass "1111"
```

### 2. Запуск PostgreSQL з підтримкою логічної реплікації

**ВАЖЛИВО:** PostgreSQL потрібно запустити з параметром `wal_level=logical` для реплікації в ClickHouse.

```bash
docker run --name postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=1111 \
  -e POSTGRES_DB=artsapp \
  -p 5434:5434 \
  -d postgres \
  -c wal_level=logical \
  -c max_replication_slots=10 \
  -c max_wal_senders=10
```

**Перевірка конфігурації:**
```bash
docker exec postgres psql -U postgres -d artsapp -c "SHOW wal_level;"
# Має показати: logical
```

### 3. Запуск міграцій PostgreSQL

```bash
cd db
npm install
npm run migrations:run
```

**Або вручну виконайте SQL файли:**
```bash
docker exec -i postgres psql -U postgres -d artsapp < migrations/1_create_user_table.sql
docker exec -i postgres psql -U postgres -d artsapp < migrations/2_create_topic_table.sql
docker exec -i postgres psql -U postgres -d artsapp < migrations/3_create_message_table.sql
docker exec -i postgres psql -U postgres -d artsapp < migrations/4_create_topic_read.sql
docker exec -i postgres psql -U postgres -d artsapp < migrations/5_message_reads_table.sql
docker exec -i postgres psql -U postgres -d artsapp < migrations/6_create_publication.sql
```

### 4. Створення публікації для реплікації

**Публікація потрібна для MaterializedPostgreSQL в ClickHouse.**

```bash
docker exec postgres psql -U postgres -d artsapp -c "CREATE PUBLICATION clickhouse_publication FOR ALL TABLES;"
```

**Перевірка публікації:**
```bash
docker exec postgres psql -U postgres -d artsapp -c "\dRp+"
docker exec postgres psql -U postgres -d artsapp -c "SELECT * FROM pg_publication_tables;"
```

### 5. Запуск ClickHouse через Docker

```bash
docker run --name clickhouse -d \
  -e CLICKHOUSE_DB=clickhouse \
  -e CLICKHOUSE_USER=clickhouse \
  -e CLICKHOUSE_DEFAULT_ACCESS_MANAGEMENT=1 \
  -e CLICKHOUSE_PASSWORD=1111 \
  -p 8123:8123 \
  -p 9000:9000 \
  clickhouse/clickhouse-server
```

### 6. Налаштування реплікації PostgreSQL → ClickHouse

#### 6.1. Знайдіть IP адресу PostgreSQL контейнера

```bash
docker inspect postgres -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'
# Приклад виводу: 172.17.0.3
```

#### 6.2. Створіть MaterializedPostgreSQL базу в ClickHouse

```bash
docker exec clickhouse clickhouse-client --query "
SET allow_experimental_database_materialized_postgresql = 1;
CREATE DATABASE artsapp_sync
ENGINE = MaterializedPostgreSQL('172.17.0.3:5434', 'artsapp', 'postgres', '1111')
SETTINGS 
    materialized_postgresql_schema = 'public',
    materialized_postgresql_tables_list = 'users,topics,messages,topic_reads,message_reads';"
```

**Замініть `172.17.0.3` на IP адресу з кроку 6.1!**

#### 6.3. Перевірка реплікації

```bash
# Перевірте таблиці (через 5-10 секунд після створення):
docker exec clickhouse clickhouse-client --query "SHOW TABLES FROM artsapp_sync;"

# Перевірте кількість записів:
docker exec clickhouse clickhouse-client --query "
SELECT 'users' as table, count() as count FROM artsapp_sync.users
UNION ALL
SELECT 'topics', count() FROM artsapp_sync.topics
UNION ALL
SELECT 'messages', count() FROM artsapp_sync.messages;"
```

### 7. Тест реплікації в реальному часі

```bash
# В одному терміналі - додайте користувача в PostgreSQL:
docker exec postgres psql -U postgres -d artsapp -c "
INSERT INTO users (full_name, email, pass, occupation) 
VALUES ('Test User', 'test@example.com', 'hashed_password', 'Developer');"

# В іншому терміналі - перевірте в ClickHouse (через 1-2 секунди):
docker exec clickhouse clickhouse-client --query "
SELECT * FROM artsapp_sync.users WHERE email = 'test@example.com';"
```

Якщо користувач з'явився в ClickHouse - **реплікація працює!** 🎉

### 8. Запуск сервісів

```bash
# Auth сервіс
cd auth
npm install
npm run start:dev

# Chat сервіс
cd chat
npm install
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev
```

---

## 🔧 Діагностика проблем

### Проблема: "Got empty list of tables to replicate"

**Причина:** PostgreSQL не налаштований для логічної реплікації.

**Рішення:**
1. Перевірте `wal_level`: `docker exec postgres psql -U postgres -c "SHOW wal_level;"`
2. Якщо показує `replica` замість `logical` - перезапустіть контейнер з правильними параметрами (крок 2)

### Проблема: Таблиці не з'являються в ClickHouse

**Перевірте:**

1. **Публікація існує:**
```bash
docker exec postgres psql -U postgres -d artsapp -c "\dRp+"
```

2. **Слоти реплікації:**
```bash
docker exec postgres psql -U postgres -d artsapp -c "SELECT * FROM pg_replication_slots;"
```

3. **Помилки в ClickHouse:**
```bash
docker exec clickhouse clickhouse-client --query "
SELECT * FROM system.errors ORDER BY last_error_time DESC LIMIT 10;"
```

### Проблема: Connection refused між контейнерами

**Перевірте IP адреси:**
```bash
docker inspect postgres -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'
docker inspect clickhouse -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'
```

**Перевірте мережу:**
```bash
docker network inspect bridge
```

---

## 📊 Корисні команди

### PostgreSQL

```bash
# Підключення до PostgreSQL
docker exec -it postgres psql -U postgres -d artsapp

# Список таблиць
docker exec postgres psql -U postgres -d artsapp -c "\dt"

# Перевірка публікацій
docker exec postgres psql -U postgres -d artsapp -c "\dRp+"

# Статус реплікації
docker exec postgres psql -U postgres -d artsapp -c "SELECT * FROM pg_stat_replication;"
```

### ClickHouse

```bash
# Підключення до ClickHouse
docker exec -it clickhouse clickhouse-client

# Список баз даних
docker exec clickhouse clickhouse-client --query "SHOW DATABASES;"

# Список таблиць
docker exec clickhouse clickhouse-client --query "SHOW TABLES FROM artsapp_sync;"

# Інформація про базу
docker exec clickhouse clickhouse-client --query "
SELECT * FROM system.databases WHERE name = 'artsapp_sync';"

# Статистика таблиць
docker exec clickhouse clickhouse-client --query "
SELECT database, table, total_rows, total_bytes 
FROM system.tables 
WHERE database = 'artsapp_sync';"
```

### Docker

```bash
# Логи контейнерів
docker logs -f postgres
docker logs -f clickhouse
docker logs -f redis

# Перезапуск контейнерів
docker restart postgres clickhouse redis

# Зупинка всіх контейнерів
docker stop postgres clickhouse redis

# Видалення контейнерів (УВАГА: видалить дані!)
docker rm -f postgres clickhouse redis
```

---

## 🏗️ Архітектура реплікації

```
┌─────────────────┐
│   PostgreSQL    │ ← Основна база даних (OLTP)
│   (write/read)  │   - Транзакційні операції
└────────┬────────┘   - Користувачі, повідомлення
         │
         │ Логічна реплікація (wal_level=logical)
         │ через Publication
         ↓
┌─────────────────┐
│   ClickHouse    │ ← Аналітична база (OLAP)
│  (read-only)    │   - Швидкі аналітичні запити
└─────────────────┘   - Агрегації, звіти

MaterializedPostgreSQL Engine:
- Автоматична синхронізація в реальному часі
- Затримка: 1-2 секунди
- Тільки читання з ClickHouse
```

---

## ⚙️ Змінні оточення

### Auth сервіс (.env)
```env
DB_HOST=localhost
DB_PORT=5434
DB_USER=postgres
DB_PASSWORD=1111
DB_NAME=artsapp

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=1111
```

### Chat сервіс (.env)
```env
DB_HOST=localhost
DB_PORT=5434
DB_USER=postgres
DB_PASSWORD=1111
DB_NAME=artsapp
```

### Fetch сервіс (.env)
```env
PORT=4003

# ClickHouse - варіант 1: повний URL
CLICKHOUSE_URL=http://clickhouse:1111@localhost:8123/clickhouse

# ClickHouse - варіант 2: окремі параметри (автоматично сформує URL)
CLICKHOUSE_HOST=localhost
CLICKHOUSE_PORT=8123
CLICKHOUSE_USER=clickhouse
CLICKHOUSE_PASSWORD=1111
CLICKHOUSE_DB=clickhouse
CLICKHOUSE_PROTOCOL=http

FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_AUTH_URL=http://localhost:3001
NEXT_PUBLIC_CHAT_URL=http://localhost:3002
```

---

## 📝 Примітки

1. **ClickHouse MaterializedPostgreSQL** - це експериментальна функція, тому потрібно встановлювати `allow_experimental_database_materialized_postgresql=1`

2. **Логічна реплікація** потребує `wal_level=logical` в PostgreSQL - без цього реплікація не працюватиме

3. **IP адреси** Docker контейнерів можуть змінюватися при перезапуску - перевіряйте їх командою `docker inspect`

4. **Публікації** створюють snapshot таблиць для реплікації - без публікації ClickHouse не побачить таблиці

5. **Затримка реплікації** зазвичай 1-2 секунди - це нормально для логічної реплікації

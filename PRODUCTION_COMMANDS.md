# 🚀 Швидкий довідник Production команд

## 📝 Основні команди

### Запуск всіх сервісів у Production режимі
```bash
./start_prod.sh
```

### Зупинка всіх сервісів
```bash
./stop_prod.sh
```

### Перегляд логів
```bash
# Інтерактивне меню вибору сервісу
./logs_prod.sh

# Логи конкретного сервісу
./logs_prod.sh auth-service
./logs_prod.sh frontend

# Або напряму через docker compose
docker compose -f docker-compose.prod.yml logs -f
docker compose -f docker-compose.prod.yml logs -f auth-service
```

### Перезапуск сервісу
```bash
# Інтерактивне меню
./restart_service.sh

# Конкретний сервіс
./restart_service.sh auth-service

# Або напряму
docker compose -f docker-compose.prod.yml restart auth-service
```

## 📊 Моніторинг

### Статус всіх контейнерів
```bash
docker compose -f docker-compose.prod.yml ps
```

### Використання ресурсів
```bash
docker stats
```

### Інформація про контейнер
```bash
docker inspect artsapp-auth-prod
docker inspect artsapp-frontend-prod
```

## 🗄️ Робота з базами даних

### PostgreSQL

```bash
# Підключення до бази
docker exec -it artsapp-postgres-prod psql -U postgres -d artsapp

# Виконання SQL запиту
docker exec artsapp-postgres-prod psql -U postgres -d artsapp -c "SELECT * FROM users LIMIT 10;"

# Перелік таблиць
docker exec artsapp-postgres-prod psql -U postgres -d artsapp -c "\dt"

# Backup бази
docker exec artsapp-postgres-prod pg_dump -U postgres artsapp > backup_$(date +%Y%m%d).sql

# Відновлення з backup
cat backup.sql | docker exec -i artsapp-postgres-prod psql -U postgres -d artsapp
```

### Redis

```bash
# Підключення до Redis
docker exec -it artsapp-redis-prod redis-cli
# Після підключення введіть: AUTH your_password

# Переглянути всі ключі
docker exec artsapp-redis-prod redis-cli -a your_password KEYS '*'

# Отримати значення ключа
docker exec artsapp-redis-prod redis-cli -a your_password GET key_name

# Очистити кеш
docker exec artsapp-redis-prod redis-cli -a your_password FLUSHALL
```

### ClickHouse

```bash
# Підключення до ClickHouse
docker exec -it artsapp-clickhouse-prod clickhouse-client

# Перелік таблиць
docker exec artsapp-clickhouse-prod clickhouse-client --query "SHOW TABLES FROM artsapp_sync;"

# SQL запит
docker exec artsapp-clickhouse-prod clickhouse-client --query "SELECT * FROM artsapp_sync.events LIMIT 10;"

# Статистика таблиці
docker exec artsapp-clickhouse-prod clickhouse-client --query "SELECT count() FROM artsapp_sync.events;"
```

## 🔧 Управління сервісами

### Перезапуск окремого сервісу
```bash
docker compose -f docker-compose.prod.yml restart frontend
docker compose -f docker-compose.prod.yml restart auth-service
docker compose -f docker-compose.prod.yml restart chat-service
docker compose -f docker-compose.prod.yml restart events-service
docker compose -f docker-compose.prod.yml restart fetch-service
docker compose -f docker-compose.prod.yml restart posts-service
```

### Оновлення сервісу після змін коду
```bash
# 1. Перебудувати образ
docker compose -f docker-compose.prod.yml build auth-service

# 2. Перезапустити сервіс
docker compose -f docker-compose.prod.yml up -d auth-service
```

### Масштабування сервісу
```bash
docker compose -f docker-compose.prod.yml up -d --scale auth-service=3
```

## 🐛 Налагодження (Debugging)

### Подивитись логи з помилками
```bash
docker compose -f docker-compose.prod.yml logs --tail=100 auth-service | grep -i error
```

### Зайти всередину контейнера
```bash
docker exec -it artsapp-auth-prod /bin/sh
docker exec -it artsapp-frontend-prod /bin/sh
```

### Перевірити змінні оточення
```bash
docker exec artsapp-auth-prod env
```

### Перевірити мережу
```bash
docker network ls
docker network inspect artsapp-network
```

## 🧹 Очищення

### Видалити зупинені контейнери
```bash
docker compose -f docker-compose.prod.yml down
```

### Видалити контейнери та volumes (видалить дані!)
```bash
docker compose -f docker-compose.prod.yml down -v
```

### Видалити образи
```bash
docker rmi $(docker images -q 'artsapp-*')
```

### Повна очистка Docker
```bash
# УВАГА: Це видалить ВСІ невикористані образи, контейнери, мережі та volumes!
docker system prune -a --volumes
```

## 📦 Backup та відновлення

### Повний backup всіх баз даних
```bash
#!/bin/bash
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# PostgreSQL
docker exec artsapp-postgres-prod pg_dump -U postgres artsapp > $BACKUP_DIR/postgres.sql

# Redis (RDB snapshot)
docker exec artsapp-redis-prod redis-cli -a your_password BGSAVE

# ClickHouse (експорт даних)
docker exec artsapp-clickhouse-prod clickhouse-client --query "SELECT * FROM artsapp_sync.events FORMAT Native" > $BACKUP_DIR/clickhouse_events.native

echo "Backup completed: $BACKUP_DIR"
```

### Автоматичний backup (cron)
```bash
# Додайте в crontab (crontab -e):
0 2 * * * /path/to/artsapp/backup_script.sh
```

## 🔍 Корисні перевірки

### Перевірити здоров'я контейнерів
```bash
docker ps --filter "name=artsapp" --format "table {{.Names}}\t{{.Status}}"
```

### Перевірити використання дискового простору
```bash
docker system df
```

### Переглянути активні з'єднання
```bash
# PostgreSQL
docker exec artsapp-postgres-prod psql -U postgres -d artsapp -c "SELECT * FROM pg_stat_activity;"

# Redis
docker exec artsapp-redis-prod redis-cli -a your_password CLIENT LIST
```

### Перевірити порти
```bash
netstat -tulpn | grep -E "3000|4000|4001|4002|4003|4004|5432|6379|8123|9000"
```

## 🚀 Швидкі сценарії

### Повний перезапуск всього
```bash
./stop_prod.sh
./start_prod.sh
```

### Оновити код та перезапустити конкретний сервіс
```bash
# 1. Зупинити сервіс
docker compose -f docker-compose.prod.yml stop auth-service

# 2. Видалити старий образ
docker rmi artsapp-auth-service

# 3. Перебудувати
docker compose -f docker-compose.prod.yml build auth-service

# 4. Запустити
docker compose -f docker-compose.prod.yml up -d auth-service
```

### Перегляд логів у реальному часі для всіх backend сервісів
```bash
docker compose -f docker-compose.prod.yml logs -f auth-service chat-service events-service fetch-service posts-service
```

## 🔒 Безпека

### Перевірити відкриті порти
```bash
sudo nmap -sT -O localhost
```

### Оновити паролі (після зміни .env.prod)
```bash
# 1. Зупинити все
./stop_prod.sh

# 2. Видалити volumes (видалить дані!)
docker volume rm artsapp_postgres_data artsapp_redis_data artsapp_clickhouse_data

# 3. Запустити знову з новими паролями
./start_prod.sh
```

## 📊 Експорт метрик

### Експортувати метрики контейнерів
```bash
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}" > metrics_$(date +%Y%m%d).txt
```

---

## 🎯 Найчастіші завдання

| Завдання | Команда |
|----------|---------|
| Запустити все | `./start_prod.sh` |
| Зупинити все | `./stop_prod.sh` |
| Подивитись логи | `./logs_prod.sh` |
| Перезапустити сервіс | `./restart_service.sh` |
| Статус контейнерів | `docker compose -f docker-compose.prod.yml ps` |
| Використання ресурсів | `docker stats` |
| Підключення до PostgreSQL | `docker exec -it artsapp-postgres-prod psql -U postgres -d artsapp` |
| Підключення до Redis | `docker exec -it artsapp-redis-prod redis-cli` |
| Підключення до ClickHouse | `docker exec -it artsapp-clickhouse-prod clickhouse-client` |

---

**Успішної роботи! 🚀**


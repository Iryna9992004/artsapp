# 🚀 Production Deployment Guide

Повний посібник з розгортання ArtsApp у Production режимі з використанням Docker.

## 📋 Передумови

Перед початком переконайтеся, що у вас встановлено:

- **Docker** (версія 20.10 або новіша)
- **Docker Compose** (версія 2.0 або новіша)
- **Bash** (для запуску скриптів)

Перевірити версії можна командами:
```bash
docker --version
docker compose version
```

## 🎯 Швидкий старт

### 1. Підготовка конфігурації

Створіть файл `.env.prod` з шаблону:
```bash
cp env.prod.template .env.prod
```

**⚠️ ВАЖЛИВО:** Відредагуйте `.env.prod` та змініть всі паролі та секрети!

```bash
nano .env.prod
# або
vim .env.prod
```

#### Обов'язкові зміни:

```bash
# Змініть паролі баз даних
PG_PASSWORD=your_strong_postgres_password_here
REDIS_PASSWORD=your_strong_redis_password_here
CLICKHOUSE_PASSWORD=your_strong_clickhouse_password_here

# Згенеруйте секрети для JWT
# Використовуйте команду: openssl rand -base64 32
JWT_ACCESS_SECRET=your_generated_secret_here
JWT_REFRESH_SECRET=your_generated_secret_here

# Вкажіть URL вашого домену (для production)
FRONTEND_URL=http://your-domain.com
```

### 2. Запуск у Production режимі

Просто запустіть скрипт:
```bash
./start_prod.sh
```

Скрипт автоматично:
- ✅ Перевірить конфігурацію
- ✅ Створить відсутні Dockerfile
- ✅ Побудує всі Docker образи
- ✅ Запустить всі контейнери у фоновому режимі
- ✅ Виконає міграції бази даних
- ✅ Налаштує реплікацію PostgreSQL → ClickHouse

### 3. Перевірка статусу

Після запуску всі сервіси будуть доступні:

#### 🌐 Сервіси:
- **Frontend**: http://localhost:3000
- **Auth Service**: http://localhost:4000
- **Chat Service**: http://localhost:4001
- **Events Service**: http://localhost:4002
- **Fetch Service**: http://localhost:4003
- **Posts Service**: http://localhost:4004

#### 🗄️ Бази даних:
- **PostgreSQL**: localhost:5432 (user: postgres, db: artsapp)
- **Redis**: localhost:6379
- **ClickHouse**: localhost:8123 (HTTP), localhost:9000 (Native)

## 🛠️ Управління контейнерами

### Переглянути статус всіх контейнерів
```bash
docker compose -f docker-compose.prod.yml ps
```

### Переглянути логи

Всі сервіси:
```bash
docker compose -f docker-compose.prod.yml logs -f
```

Конкретний сервіс:
```bash
docker compose -f docker-compose.prod.yml logs -f auth-service
docker compose -f docker-compose.prod.yml logs -f frontend
```

### Перезапустити сервіс
```bash
docker compose -f docker-compose.prod.yml restart auth-service
```

### Зупинити всі контейнери

Використовуйте скрипт:
```bash
./stop_prod.sh
```

Скрипт запитає, чи потрібно видалити дані (volumes). Якщо відповісте "yes", всі дані з баз будуть видалені.

### Оновити сервіс

Якщо ви внесли зміни в код:

```bash
# Перебудувати конкретний сервіс
docker compose -f docker-compose.prod.yml build auth-service

# Перезапустити сервіс
docker compose -f docker-compose.prod.yml up -d auth-service
```

## 🗄️ Робота з базами даних

### PostgreSQL

Підключитися до бази:
```bash
docker exec -it artsapp-postgres-prod psql -U postgres -d artsapp
```

Виконати SQL запит:
```bash
docker exec artsapp-postgres-prod psql -U postgres -d artsapp -c "SELECT * FROM users LIMIT 10;"
```

Зробити backup:
```bash
docker exec artsapp-postgres-prod pg_dump -U postgres artsapp > backup.sql
```

Відновити з backup:
```bash
cat backup.sql | docker exec -i artsapp-postgres-prod psql -U postgres -d artsapp
```

### Redis

Підключитися до Redis:
```bash
docker exec -it artsapp-redis-prod redis-cli
# Введіть пароль: AUTH your_redis_password
```

Переглянути всі ключі:
```bash
docker exec artsapp-redis-prod redis-cli -a your_redis_password KEYS '*'
```

### ClickHouse

Підключитися до ClickHouse:
```bash
docker exec -it artsapp-clickhouse-prod clickhouse-client
```

Перевірити таблиці:
```bash
docker exec artsapp-clickhouse-prod clickhouse-client --query "SHOW TABLES FROM artsapp_sync;"
```

Переглянути дані:
```bash
docker exec artsapp-clickhouse-prod clickhouse-client --query "SELECT * FROM artsapp_sync.events LIMIT 10;"
```

## 🔧 Налаштування для реального Production

### 1. Використання domain замість localhost

Оновіть `.env.prod`:
```bash
FRONTEND_URL=https://your-domain.com
NEXT_PUBLIC_AUTH_URL=https://api.your-domain.com/auth
NEXT_PUBLIC_CHAT_URL=https://api.your-domain.com/chat
NEXT_PUBLIC_EVENTS_URL=https://api.your-domain.com/events
NEXT_PUBLIC_FETCH_URL=https://api.your-domain.com/fetch
NEXT_PUBLIC_POSTS_URL=https://api.your-domain.com/posts
```

### 2. Налаштування Nginx як reverse proxy

Створіть файл `nginx.conf`:
```nginx
upstream frontend {
    server localhost:3000;
}

upstream auth_service {
    server localhost:4000;
}

upstream chat_service {
    server localhost:4001;
}

# ... інші upstream блоки

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/auth {
        proxy_pass http://auth_service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # ... інші location блоки
}
```

### 3. SSL сертифікати (Let's Encrypt)

```bash
# Встановіть certbot
sudo apt-get install certbot python3-certbot-nginx

# Отримайте сертифікат
sudo certbot --nginx -d your-domain.com
```

### 4. Автоматичний перезапуск контейнерів

Контейнери вже налаштовані з `restart: unless-stopped`, тому вони автоматично перезапустяться після збою або перезавантаження сервера.

## 📊 Моніторинг

### Переглянути використання ресурсів
```bash
docker stats
```

### Переглянути розмір образів
```bash
docker images
```

### Очистити невикористані ресурси
```bash
docker system prune -a
```

## 🐛 Troubleshooting

### Контейнер не запускається

Перегляньте логи:
```bash
docker compose -f docker-compose.prod.yml logs service_name
```

### Порт вже зайнятий

Перевірте, що займає порт:
```bash
lsof -i :4000
# або
netstat -tulpn | grep 4000
```

### Проблеми з підключенням до бази даних

Переконайтеся, що контейнер працює:
```bash
docker compose -f docker-compose.prod.yml ps
```

Перевірте здоров'я PostgreSQL:
```bash
docker exec artsapp-postgres-prod pg_isready -U postgres
```

### Скинути все та почати з нуля

```bash
# Зупинити всі контейнери та видалити volumes
./stop_prod.sh
# Введіть "yes" коли запитає про видалення даних

# Видалити всі образи (опціонально)
docker rmi $(docker images -q artsapp-*)

# Запустити знову
./start_prod.sh
```

## 🔒 Безпека

### Checklist для Production:

- [ ] Змінено всі паролі в `.env.prod`
- [ ] Згенеровано надійні JWT секрети
- [ ] Налаштовано SSL сертифікати
- [ ] Налаштовано firewall (відкрито тільки потрібні порти)
- [ ] Налаштовано backup баз даних
- [ ] Обмежено доступ до portainer/docker socket
- [ ] Налаштовано логування та моніторинг
- [ ] Перевірено CORS налаштування

## 📦 Backup та відновлення

### Створення повного backup

```bash
#!/bin/bash
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# PostgreSQL
docker exec artsapp-postgres-prod pg_dump -U postgres artsapp > $BACKUP_DIR/postgres.sql

# Redis
docker exec artsapp-redis-prod redis-cli -a your_password --rdb $BACKUP_DIR/redis.rdb

# ClickHouse
docker exec artsapp-clickhouse-prod clickhouse-client --query "BACKUP DATABASE artsapp_sync TO Disk('default', '$BACKUP_DIR/clickhouse/')"

echo "Backup completed: $BACKUP_DIR"
```

## 📞 Підтримка

Якщо виникли проблеми:
1. Перевірте логи контейнерів
2. Переконайтеся, що всі змінні в `.env.prod` правильні
3. Перевірте, що порти не зайняті іншими процесами

## 📝 Структура файлів

```
artsapp/
├── docker-compose.prod.yml     # Конфігурація Docker Compose для production
├── env.prod.template           # Шаблон змінних оточення
├── .env.prod                   # Ваші production змінні (не в git)
├── start_prod.sh              # Скрипт для запуску всіх контейнерів
├── stop_prod.sh               # Скрипт для зупинки контейнерів
├── PRODUCTION_DEPLOYMENT.md   # Цей файл
└── [сервіси]/
    ├── Dockerfile             # Dockerfile для кожного сервісу
    └── ...
```

---

**Успішного деплою! 🚀**


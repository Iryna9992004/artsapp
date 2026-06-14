# 🚀 Production Deployment Guide

Інструкція по запуску ArtsApp у production режимі з використанням Docker.

## 📋 Швидкий старт

### 1. Запуск всіх сервісів
```bash
./start-prod.sh
```

Цей скрипт:
- ✅ Перевіряє наявність Docker та необхідних файлів
- ✅ Створює `.env` файл з дефолтними налаштуваннями (якщо не існує)
- ✅ Зупиняє старі контейнери
- ✅ Будує Docker образи
- ✅ Запускає всі контейнери у фоновому режимі
- ✅ Перевіряє здоров'я всіх сервісів

### 2. Зупинка всіх сервісів
```bash
./stop-prod.sh
```

Зупинка з видаленням всіх даних (volumes):
```bash
./stop-prod.sh --volumes
```

### 3. Перегляд логів
```bash
# Логи всіх сервісів
./logs-prod.sh

# Логи конкретного сервісу
./logs-prod.sh auth-service
./logs-prod.sh frontend
```

## 🌐 Доступні сервіси

Після запуску сервіси будуть доступні за наступними адресами:

| Сервіс | URL | Опис |
|--------|-----|------|
| **Frontend** | http://localhost:3000 | Веб-додаток Next.js |
| **Auth Service** | http://localhost:4000 | Автентифікація та авторизація |
| **Chat Service** | http://localhost:4001 | Чат та обмін повідомленнями |
| **Events Service** | http://localhost:4002 | Управління подіями |
| **Fetch Service** | http://localhost:4003 | Отримання даних |
| **Posts Service** | http://localhost:4004 | Управління публікаціями |
| **PostgreSQL** | localhost:5434 | База даних |
| **Redis** | localhost:6379 | Кеш та черги |
| **ClickHouse** | localhost:8123 / 9000 | Аналітична БД |

## 🔧 Налаштування

### Змінні середовища

Перед запуском у production **обов'язково** змініть наступні параметри у файлі `.env`:

```env
# ⚠️ КРИТИЧНО: Змініть ці паролі!
PG_PASSWORD=your-strong-password-here
REDIS_PASSWORD=your-strong-redis-password
CLICKHOUSE_PASSWORD=your-strong-clickhouse-password

# ⚠️ КРИТИЧНО: Змініть JWT секрети!
JWT_ACCESS_SECRET=generate-strong-random-secret-here
JWT_REFRESH_SECRET=generate-another-strong-random-secret-here

# URL вашого домену
FRONTEND_URL=https://yourdomain.com
NEXT_PUBLIC_AUTH_URL=https://yourdomain.com/api/auth
NEXT_PUBLIC_CHAT_URL=https://yourdomain.com/api/chat
NEXT_PUBLIC_EVENTS_URL=https://yourdomain.com/api/events
NEXT_PUBLIC_FETCH_URL=https://yourdomain.com/api/fetch
NEXT_PUBLIC_POSTS_URL=https://yourdomain.com/api/posts
```

### Генерація безпечних секретів

```bash
# Для JWT секретів
openssl rand -base64 64

# Для паролів
openssl rand -base64 32
```

## 📊 Моніторинг

### Статус контейнерів
```bash
docker-compose -f docker-compose.prod.yml ps
```

### Використання ресурсів
```bash
docker stats
```

### Логи конкретного сервісу
```bash
docker-compose -f docker-compose.prod.yml logs -f [service-name]
```

Доступні сервіси:
- `auth-service`
- `chat-service`
- `events-service`
- `fetch-service`
- `posts-service`
- `frontend`
- `postgres`
- `redis`
- `clickhouse`

## 🔄 Оновлення та обслуговування

### Перезапуск конкретного сервісу
```bash
docker-compose -f docker-compose.prod.yml restart [service-name]
```

### Перебудова образу після змін у коді
```bash
docker-compose -f docker-compose.prod.yml build [service-name]
docker-compose -f docker-compose.prod.yml up -d [service-name]
```

### Очищення невикористаних Docker ресурсів
```bash
docker system prune -a --volumes
```

## 🐛 Налагодження

### Проблема: Контейнер не запускається
```bash
# Перевірте логи
./logs-prod.sh [service-name]

# Перевірте статус
docker-compose -f docker-compose.prod.yml ps

# Перезапустіть контейнер
docker-compose -f docker-compose.prod.yml restart [service-name]
```

### Проблема: База даних не доступна
```bash
# Перевірте здоров'я PostgreSQL
docker exec artsapp-postgres-prod pg_isready -U postgres

# Підключіться до PostgreSQL
docker exec -it artsapp-postgres-prod psql -U postgres -d artsapp
```

### Проблема: Сервіс не може підключитися до БД
```bash
# Перевірте мережу
docker network inspect artsapp-artsapp-network

# Перевірте змінні середовища
docker-compose -f docker-compose.prod.yml config
```

## 🔐 Безпека

### Рекомендації для production:

1. ✅ Змініть всі дефолтні паролі
2. ✅ Використовуйте сильні JWT секрети
3. ✅ Налаштуйте HTTPS/SSL
4. ✅ Обмежте доступ до портів БД (видаліть `ports` з docker-compose)
5. ✅ Використовуйте reverse proxy (nginx/traefik)
6. ✅ Налаштуйте backup баз даних
7. ✅ Встановіть обмеження ресурсів для контейнерів
8. ✅ Використовуйте Docker secrets для чутливих даних

## 📦 Backup і відновлення

### Backup PostgreSQL
```bash
docker exec artsapp-postgres-prod pg_dump -U postgres artsapp > backup_$(date +%Y%m%d).sql
```

### Відновлення PostgreSQL
```bash
docker exec -i artsapp-postgres-prod psql -U postgres artsapp < backup_20260112.sql
```

### Backup volumes
```bash
docker run --rm -v artsapp_postgres_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/postgres_backup_$(date +%Y%m%d).tar.gz -C /data .
```

## 📝 Корисні команди

```bash
# Перезапуск всіх сервісів
./stop-prod.sh && ./start-prod.sh

# Перегляд ресурсів
docker-compose -f docker-compose.prod.yml top

# Виконання команди в контейнері
docker-compose -f docker-compose.prod.yml exec [service-name] [command]

# Інспекція контейнера
docker inspect artsapp-[service-name]-prod

# Очищення логів
docker-compose -f docker-compose.prod.yml logs --tail=0 -f
```

## 🆘 Підтримка

При виникненні проблем:
1. Перевірте логи: `./logs-prod.sh`
2. Перевірте статус: `docker-compose -f docker-compose.prod.yml ps`
3. Перевірте здоров'я сервісів
4. Перевірте змінні середовища в `.env`

---

**Створено для проекту ArtsApp** 🎨






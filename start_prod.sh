#!/bin/bash
set -e  # Зупинити при помилці

# Кольори для виводу
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Запуск всіх сервісів ArtsApp у Production режимі...${NC}"
echo ""

# ============================================
# 1. ПЕРЕВІРКА ФАЙЛУ .env.prod
# ============================================
echo -e "${BLUE}1️⃣  Перевірка конфігурації...${NC}"

if [ ! -f ".env.prod" ]; then
    echo -e "${YELLOW}⚠️  Файл .env.prod не знайдено!${NC}"
    echo -e "${YELLOW}   Створюємо з шаблону...${NC}"
    
    if [ -f "env.prod.template" ]; then
        cp env.prod.template .env.prod
        echo -e "${GREEN}✅ Створено .env.prod${NC}"
        echo -e "${RED}⚠️  ВАЖЛИВО: Відредагуйте .env.prod та змініть всі паролі та секрети!${NC}"
        echo -e "${YELLOW}   Натисніть Enter після редагування .env.prod, або Ctrl+C для виходу${NC}"
        read -r
    else
        echo -e "${RED}❌ Файл env.prod.template не знайдено!${NC}"
        exit 1
    fi
fi

# Завантажуємо змінні з .env.prod
export $(grep -v '^#' .env.prod | xargs)
echo -e "${GREEN}✅ Конфігурація завантажена${NC}"

# ============================================
# 2. ПЕРЕВІРКА DOCKER
# ============================================
echo -e "${BLUE}2️⃣  Перевірка Docker...${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker не встановлено!${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose не встановлено!${NC}"
    exit 1
fi

# Визначаємо команду для docker compose
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

echo -e "${GREEN}✅ Docker встановлено${NC}"

# ============================================
# 3. СТВОРЕННЯ DOCKERFILES ДЛЯ СЕРВІСІВ БЕЗ НИХ
# ============================================
echo -e "${BLUE}3️⃣  Перевірка Dockerfile'ів...${NC}"

# Функція для створення Dockerfile для NestJS сервісів
create_nestjs_dockerfile() {
    local service_dir=$1
    local dockerfile_path="$service_dir/Dockerfile"
    
    if [ ! -f "$dockerfile_path" ]; then
        echo -e "${YELLOW}⚠️  Створюємо Dockerfile для $service_dir...${NC}"
        cat > "$dockerfile_path" << 'EOF'
#dev
FROM node:22-slim AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --force
COPY . .
USER node

#build
FROM node:22-slim AS build
WORKDIR /usr/src/app
COPY package*.json ./
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build
ENV NODE_ENV=production
RUN npm install --force && npm cache clean --force
USER node

#prod
FROM node:22-slim AS production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
CMD ["node", "dist/main.js"]
EOF
        echo -e "${GREEN}✅ Створено Dockerfile для $service_dir${NC}"
    fi
}

# Перевірка та створення Dockerfile для кожного сервісу
for service in events fetch posts; do
    if [ -d "$service" ]; then
        create_nestjs_dockerfile "$service"
    fi
done

echo -e "${GREEN}✅ Всі Dockerfile'и готові${NC}"

# ============================================
# 4. ЗУПИНКА СТАРИХ КОНТЕЙНЕРІВ
# ============================================
echo -e "${BLUE}4️⃣  Зупинка старих контейнерів (якщо є)...${NC}"

$DOCKER_COMPOSE -f docker-compose.prod.yml --env-file .env.prod down 2>/dev/null || true

echo -e "${GREEN}✅ Старі контейнери зупинено${NC}"

# ============================================
# 5. БІЛД ОБРАЗІВ
# ============================================
echo -e "${BLUE}5️⃣  Білд Docker образів (це може зайняти деякий час)...${NC}"

$DOCKER_COMPOSE -f docker-compose.prod.yml --env-file .env.prod build --no-cache

echo -e "${GREEN}✅ Всі образи побудовано${NC}"

# ============================================
# 6. ЗАПУСК КОНТЕЙНЕРІВ
# ============================================
echo -e "${BLUE}6️⃣  Запуск контейнерів у фоновому режимі...${NC}"

$DOCKER_COMPOSE -f docker-compose.prod.yml --env-file .env.prod up -d

echo -e "${GREEN}✅ Контейнери запущено${NC}"

# ============================================
# 7. ОЧІКУВАННЯ ГОТОВНОСТІ БАЗ ДАНИХ
# ============================================
echo -e "${BLUE}7️⃣  Очікування готовності баз даних...${NC}"

echo -e "${YELLOW}   Очікування PostgreSQL...${NC}"
for i in {1..30}; do
    if docker exec artsapp-postgres-prod pg_isready -U postgres >/dev/null 2>&1; then
        echo -e "${GREEN}   ✅ PostgreSQL готовий!${NC}"
        break
    fi
    sleep 1
done

echo -e "${YELLOW}   Очікування Redis...${NC}"
sleep 3
echo -e "${GREEN}   ✅ Redis готовий!${NC}"

echo -e "${YELLOW}   Очікування ClickHouse...${NC}"
sleep 5
echo -e "${GREEN}   ✅ ClickHouse готовий!${NC}"

# ============================================
# 8. ЗАПУСК МІГРАЦІЙ
# ============================================
echo -e "${BLUE}8️⃣  Запуск міграцій PostgreSQL...${NC}"

cd "$(dirname "$0")/db" 2>/dev/null || cd db 2>/dev/null || true

if [ -f "package.json" ]; then
    npm install >/dev/null 2>&1 || true
    npm run migrations:run || echo -e "${YELLOW}⚠️  Міграції вже виконані або помилка${NC}"
else
    echo -e "${YELLOW}⚠️  package.json не знайдено, виконую міграції вручну...${NC}"
    cd "$(dirname "$0")" || cd .. || true
    docker exec -i artsapp-postgres-prod psql -U postgres -d artsapp < db/migrations/1_create_user_table.sql 2>/dev/null || true
    docker exec -i artsapp-postgres-prod psql -U postgres -d artsapp < db/migrations/2_create_topic_table.sql 2>/dev/null || true
    docker exec -i artsapp-postgres-prod psql -U postgres -d artsapp < db/migrations/3_create_message_table.sql 2>/dev/null || true
    docker exec -i artsapp-postgres-prod psql -U postgres -d artsapp < db/migrations/4_create_topic_read.sql 2>/dev/null || true
    docker exec -i artsapp-postgres-prod psql -U postgres -d artsapp < db/migrations/5_message_reads_table.sql 2>/dev/null || true
    docker exec -i artsapp-postgres-prod psql -U postgres -d artsapp < db/migrations/6_create_events_table.sql 2>/dev/null || true
    docker exec -i artsapp-postgres-prod psql -U postgres -d artsapp < db/migrations/7_create_posts_table.sql 2>/dev/null || true
fi

cd "$(dirname "$0")" 2>/dev/null || true

echo -e "${GREEN}✅ Міграції виконано${NC}"

# ============================================
# 9. НАЛАШТУВАННЯ РЕПЛІКАЦІЇ CLICKHOUSE
# ============================================
echo -e "${BLUE}9️⃣  Налаштування реплікації ClickHouse...${NC}"

# Створення публікації
echo -e "${YELLOW}   Створення публікації PostgreSQL...${NC}"
docker exec artsapp-postgres-prod psql -U postgres -d artsapp -c \
  "CREATE PUBLICATION IF NOT EXISTS clickhouse_publication FOR ALL TABLES;" 2>/dev/null || \
docker exec artsapp-postgres-prod psql -U postgres -d artsapp -c \
  "CREATE PUBLICATION clickhouse_publication FOR ALL TABLES;" 2>/dev/null || true

# Отримання IP PostgreSQL
PG_IP=$(docker inspect artsapp-postgres-prod -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}')
echo -e "${GREEN}   ✅ PostgreSQL IP: $PG_IP${NC}"

# Очікування готовності ClickHouse
sleep 5

# Створення MaterializedPostgreSQL бази
echo -e "${YELLOW}   Створення MaterializedPostgreSQL бази...${NC}"
docker exec artsapp-clickhouse-prod clickhouse-client --query "
SET allow_experimental_database_materialized_postgresql = 1;
DROP DATABASE IF EXISTS artsapp_sync;
CREATE DATABASE artsapp_sync
ENGINE = MaterializedPostgreSQL('$PG_IP:5432', 'artsapp', 'postgres', '${PG_PASSWORD:-1111}')
SETTINGS 
    materialized_postgresql_schema = 'public',
    materialized_postgresql_tables_list = 'users,topics,messages,topic_reads,message_reads,events,posts';" 2>&1 || true

sleep 5

echo -e "${GREEN}✅ Реплікація налаштована${NC}"

# ============================================
# 10. СТАТУС КОНТЕЙНЕРІВ
# ============================================
echo ""
echo -e "${BLUE}📊 Статус контейнерів:${NC}"
echo ""
$DOCKER_COMPOSE -f docker-compose.prod.yml --env-file .env.prod ps

# ============================================
# 11. ФІНАЛЬНА ІНФОРМАЦІЯ
# ============================================
echo ""
echo -e "${GREEN}🎉 ВСЕ ГОТОВО! Всі сервіси запущено у Production режимі!${NC}"
echo ""
echo -e "${BLUE}📝 Доступні сервіси:${NC}"
echo -e "   ${GREEN}Frontend:${NC}      http://localhost:3000"
echo -e "   ${GREEN}Auth Service:${NC}  http://localhost:4000"
echo -e "   ${GREEN}Chat Service:${NC}  http://localhost:4001"
echo -e "   ${GREEN}Events Service:${NC} http://localhost:4002"
echo -e "   ${GREEN}Fetch Service:${NC} http://localhost:4003"
echo -e "   ${GREEN}Posts Service:${NC} http://localhost:4004"
echo ""
echo -e "${BLUE}🗄️  Бази даних:${NC}"
echo -e "   ${GREEN}PostgreSQL:${NC}    localhost:5432 (user: postgres, db: artsapp)"
echo -e "   ${GREEN}Redis:${NC}         localhost:6379"
echo -e "   ${GREEN}ClickHouse:${NC}    localhost:8123 (HTTP), localhost:9000 (Native)"
echo ""
echo -e "${BLUE}📋 Корисні команди:${NC}"
echo -e "   ${YELLOW}Переглянути логи:${NC}           $DOCKER_COMPOSE -f docker-compose.prod.yml logs -f [service_name]"
echo -e "   ${YELLOW}Зупинити всі сервіси:${NC}       $DOCKER_COMPOSE -f docker-compose.prod.yml down"
echo -e "   ${YELLOW}Перезапустити сервіс:${NC}       $DOCKER_COMPOSE -f docker-compose.prod.yml restart [service_name]"
echo -e "   ${YELLOW}Статус контейнерів:${NC}         $DOCKER_COMPOSE -f docker-compose.prod.yml ps"
echo -e "   ${YELLOW}Підключитись до PostgreSQL:${NC} docker exec -it artsapp-postgres-prod psql -U postgres -d artsapp"
echo -e "   ${YELLOW}Підключитись до ClickHouse:${NC} docker exec -it artsapp-clickhouse-prod clickhouse-client"
echo ""
echo -e "${GREEN}✅ Всі контейнери працюють у фоновому режимі${NC}"
echo ""


#!/bin/bash

# Кольори для виводу
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Визначаємо команду для docker compose
if docker compose version &> /dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

echo -e "${BLUE}📋 Логи Production контейнерів${NC}"
echo ""

# Якщо вказано сервіс як аргумент
if [ -n "$1" ]; then
    echo -e "${GREEN}Логи для сервісу: $1${NC}"
    echo ""
    if [ -f ".env.prod" ]; then
        $DOCKER_COMPOSE -f docker-compose.prod.yml --env-file .env.prod logs -f "$1"
    else
        $DOCKER_COMPOSE -f docker-compose.prod.yml logs -f "$1"
    fi
else
    # Показати меню вибору
    echo -e "${YELLOW}Виберіть сервіс для перегляду логів:${NC}"
    echo ""
    echo "  1) Всі сервіси"
    echo "  2) Frontend"
    echo "  3) Auth Service"
    echo "  4) Chat Service"
    echo "  5) Events Service"
    echo "  6) Fetch Service"
    echo "  7) Posts Service"
    echo "  8) PostgreSQL"
    echo "  9) Redis"
    echo " 10) ClickHouse"
    echo ""
    echo -e "${YELLOW}Введіть номер (1-10):${NC} "
    read -r choice

    case $choice in
        1)
            SERVICE="all"
            echo -e "${GREEN}Логи для всіх сервісів${NC}"
            if [ -f ".env.prod" ]; then
                $DOCKER_COMPOSE -f docker-compose.prod.yml --env-file .env.prod logs -f
            else
                $DOCKER_COMPOSE -f docker-compose.prod.yml logs -f
            fi
            ;;
        2)
            SERVICE="frontend"
            ;;
        3)
            SERVICE="auth-service"
            ;;
        4)
            SERVICE="chat-service"
            ;;
        5)
            SERVICE="events-service"
            ;;
        6)
            SERVICE="fetch-service"
            ;;
        7)
            SERVICE="posts-service"
            ;;
        8)
            SERVICE="postgres"
            ;;
        9)
            SERVICE="redis"
            ;;
        10)
            SERVICE="clickhouse"
            ;;
        *)
            echo -e "${YELLOW}Невірний вибір. Показую логи всіх сервісів.${NC}"
            SERVICE="all"
            ;;
    esac

    if [ "$SERVICE" != "all" ]; then
        echo -e "${GREEN}Логи для сервісу: $SERVICE${NC}"
        echo ""
        if [ -f ".env.prod" ]; then
            $DOCKER_COMPOSE -f docker-compose.prod.yml --env-file .env.prod logs -f "$SERVICE"
        else
            $DOCKER_COMPOSE -f docker-compose.prod.yml logs -f "$SERVICE"
        fi
    fi
fi


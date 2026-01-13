#!/bin/bash

# Кольори для виводу
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Визначаємо команду для docker compose
if docker compose version &> /dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

echo -e "${BLUE}🔄 Перезапуск Production сервісів${NC}"
echo ""

# Список доступних сервісів
SERVICES=(
    "frontend"
    "auth-service"
    "chat-service"
    "events-service"
    "fetch-service"
    "posts-service"
    "postgres"
    "redis"
    "clickhouse"
)

# Якщо вказано сервіс як аргумент
if [ -n "$1" ]; then
    SERVICE="$1"
    echo -e "${YELLOW}Перезапуск сервісу: $SERVICE${NC}"
    
    if [ -f ".env.prod" ]; then
        $DOCKER_COMPOSE -f docker-compose.prod.yml --env-file .env.prod restart "$SERVICE"
    else
        $DOCKER_COMPOSE -f docker-compose.prod.yml restart "$SERVICE"
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Сервіс $SERVICE перезапущено${NC}"
    else
        echo -e "${RED}❌ Помилка перезапуску сервісу $SERVICE${NC}"
        exit 1
    fi
else
    # Показати меню вибору
    echo -e "${YELLOW}Виберіть сервіс для перезапуску:${NC}"
    echo ""
    
    for i in "${!SERVICES[@]}"; do
        printf "  %2d) %s\n" $((i+1)) "${SERVICES[$i]}"
    done
    
    echo ""
    echo -e "${YELLOW}Введіть номер (1-${#SERVICES[@]}):${NC} "
    read -r choice

    # Перевірка вибору
    if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le "${#SERVICES[@]}" ]; then
        SERVICE="${SERVICES[$((choice-1))]}"
        
        echo ""
        echo -e "${YELLOW}Перезапуск сервісу: $SERVICE${NC}"
        
        if [ -f ".env.prod" ]; then
            $DOCKER_COMPOSE -f docker-compose.prod.yml --env-file .env.prod restart "$SERVICE"
        else
            $DOCKER_COMPOSE -f docker-compose.prod.yml restart "$SERVICE"
        fi
        
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}✅ Сервіс $SERVICE перезапущено${NC}"
            echo ""
            echo -e "${BLUE}📋 Переглянути логи:${NC}"
            echo -e "   ./logs_prod.sh $SERVICE"
        else
            echo -e "${RED}❌ Помилка перезапуску сервісу $SERVICE${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ Невірний вибір${NC}"
        exit 1
    fi
fi


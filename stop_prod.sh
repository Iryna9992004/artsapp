#!/bin/bash
set -e  # Зупинити при помилці

# Кольори для виводу
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🛑 Зупинка всіх Production контейнерів ArtsApp...${NC}"
echo ""

# Визначаємо команду для docker compose
if docker compose version &> /dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Перевірка чи існує файл .env.prod
if [ ! -f ".env.prod" ]; then
    echo -e "${YELLOW}⚠️  Файл .env.prod не знайдено, використовуємо значення за замовчуванням${NC}"
fi

# Запитання про видалення volumes (даних)
echo -e "${YELLOW}❓ Бажаєте видалити всі дані (volumes)?${NC}"
echo -e "   ${RED}⚠️  УВАГА: Це видалить всі дані з баз даних!${NC}"
echo -e "   Введіть 'yes' для видалення даних або натисніть Enter для збереження:"
read -r remove_volumes

if [ "$remove_volumes" = "yes" ]; then
    echo -e "${BLUE}🗑️  Зупинка контейнерів та видалення volumes...${NC}"
    if [ -f ".env.prod" ]; then
        $DOCKER_COMPOSE -f docker-compose.prod.yml --env-file .env.prod down -v
    else
        $DOCKER_COMPOSE -f docker-compose.prod.yml down -v
    fi
    echo -e "${GREEN}✅ Контейнери зупинено та volumes видалено${NC}"
else
    echo -e "${BLUE}🛑 Зупинка контейнерів (дані зберігаються)...${NC}"
    if [ -f ".env.prod" ]; then
        $DOCKER_COMPOSE -f docker-compose.prod.yml --env-file .env.prod down
    else
        $DOCKER_COMPOSE -f docker-compose.prod.yml down
    fi
    echo -e "${GREEN}✅ Контейнери зупинено (дані збережено)${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Готово!${NC}"
echo ""
echo -e "${BLUE}📋 Корисні команди:${NC}"
echo -e "   ${YELLOW}Запустити знову:${NC}          ./start_prod.sh"
echo -e "   ${YELLOW}Переглянути volumes:${NC}      docker volume ls"
echo -e "   ${YELLOW}Видалити volumes вручну:${NC}  docker volume prune"
echo ""


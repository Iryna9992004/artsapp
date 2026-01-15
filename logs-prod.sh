#!/bin/bash

# Скрипт для перегляду логів ArtsApp production контейнерів
# Використання: ./logs-prod.sh [service-name]

set -e

# Перевірка чи існує docker-compose.prod.yml
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Помилка: docker-compose.prod.yml не знайдено!"
    exit 1
fi

if [ -z "$1" ]; then
    echo "📋 Логи всіх сервісів (Ctrl+C для виходу)..."
    echo ""
    docker-compose -f docker-compose.prod.yml logs -f --tail=100
else
    echo "📋 Логи сервісу: $1 (Ctrl+C для виходу)..."
    echo ""
    docker-compose -f docker-compose.prod.yml logs -f --tail=100 "$1"
fi






#!/bin/bash

# Скрипт для зупинки всіх контейнерів ArtsApp у production режимі
# Використання: ./stop-prod.sh [--volumes]

set -e

echo "🛑 Зупинка ArtsApp production контейнерів..."
echo ""

# Перевірка чи існує docker-compose.prod.yml
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Помилка: docker-compose.prod.yml не знайдено!"
    exit 1
fi

# Перевірка параметра --volumes
if [ "$1" == "--volumes" ] || [ "$1" == "-v" ]; then
    echo "⚠️  УВАГА: Буде видалено всі дані (volumes)!"
    read -p "Ви впевнені? (yes/no): " confirm
    if [ "$confirm" == "yes" ]; then
        echo "🗑️  Зупинка контейнерів і видалення volumes..."
        docker-compose -f docker-compose.prod.yml down -v
        echo "✅ Контейнери зупинено та volumes видалено"
    else
        echo "❌ Операцію скасовано"
        exit 0
    fi
else
    echo "🛑 Зупинка контейнерів (дані збережуться)..."
    docker-compose -f docker-compose.prod.yml down
    echo "✅ Контейнери зупинено"
fi

echo ""
echo "📝 Для повторного запуску використовуйте: ./start-prod.sh"
echo "📝 Для видалення даних використовуйте: ./stop-prod.sh --volumes"






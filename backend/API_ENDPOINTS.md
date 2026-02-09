# API Endpoints Backend

Документація всіх доступних API endpoints в об'єднаному backend сервісі.

## 📋 Endpoints

### Topics (Теми)

#### Отримання тем (з ClickHouse)
- **GET** `/fetch/topic/?limit={limit}&offset={offset}&searchText={searchText}`
  - Отримує список тем з ClickHouse
  - Параметри:
    - `limit` (number) - кількість записів
    - `offset` (number) - зміщення
    - `searchText` (string, optional) - текст для пошуку

- **GET** `/fetch/topic/info/:id`
  - Отримує інформацію про конкретну тему

#### Створення теми
- **POST** `/chat/create`
  - Створює нову тему
  - Body: `{ text: string, user_id: string }`

- **POST** `/chat/read`
  - Позначає тему як прочитану
  - Body: `{ user_id: number, topic_id: number }`

### Events (Події)

#### Отримання подій (з ClickHouse)
- **GET** `/fetch/events/?limit={limit}&offset={offset}&searchText={searchText}`
  - Отримує список подій з ClickHouse
  - Параметри:
    - `limit` (number) - кількість записів
    - `offset` (number) - зміщення
    - `searchText` (string, optional) - текст для пошуку

#### Створення події
- **POST** `/events`
  - Створює нову подію
  - Body: `{ title: string, event_description: string, user_id: number }`

### Posts (Публікації)

#### Отримання публікацій (з ClickHouse)
- **GET** `/fetch/posts/?limit={limit}&offset={offset}&searchText={searchText}`
  - Отримує список публікацій з ClickHouse
  - Параметри:
    - `limit` (number) - кількість записів
    - `offset` (number) - зміщення
    - `searchText` (string, optional) - текст для пошуку

#### Створення публікації
- **POST** `/posts/create`
  - Створює нову публікацію
  - Body: `{ title: string, post_description: string, user_id: number }`

### Auth (Автентифікація)

- **POST** `/auth/register` - Реєстрація користувача
- **POST** `/auth/login` - Вхід
- **POST** `/auth/logout` - Вихід
- **POST** `/auth/refresh` - Оновлення токену

### Chat (Чат)

- **WebSocket** `/chat` - Підключення до чату
  - Events:
    - `send` - відправка повідомлення
    - `read` - позначення повідомлення як прочитане

## 🔗 Base URL

Всі endpoints доступні через один базовий URL:
- Development: `http://localhost:4000`
- Production: налаштовується через `BACKEND_PORT` в `.env`

## 📝 Примітки

- Endpoints з префіксом `/fetch/` використовують ClickHouse для читання даних
- Endpoints без префіксу `/fetch/` використовують PostgreSQL для запису даних
- Всі запити мають CORS налаштування для frontend (`http://localhost:3000`)

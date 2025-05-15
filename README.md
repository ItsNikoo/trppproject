# 🛍️ Интернет-магазин вещей (WEB-приложение)

Web-приложение для интернет-магазина вещей, разработанное с использованием Django и React JS.

Backend-часть интернет-магазина представляет собой REST API для управления товарами, категориями и фотографиями.
Frontend-часть - SPA приложение, написанное на React JS

## 📦 Особенности

- Полноценное REST API для интернет-магазина
- Управление товарами и категориями
- Загрузка фотографий товаров (Yandex Object Storage)
- Документация API (Swagger/Redoc)

## 🛠️ Технологии

- **Backend**: Django 5.2 + Django REST Framework
- **Frontend**: React JS 19
- **База данных**: SQLite (разработка)
- **Хранение файлов**: Yandex Object Storage (S3)
- **Документация**: Swagger UI

## Зависимости

- Python 3.9+
- Django 4.0+
- Django REST Framework 3.14+

Полный список зависимостей находится в файле `requirements.txt`.

## ⚙️ Dev-development

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/ItsNikoo/trppproject
   cd trppproject
    ```
2. Перейдите в backend-часть:
   ```bash
   cd backend/backend
   python manage runserver
   ```
3. Перейдите в frontend-часть:
   ```bash
    cd frontend/frontend-project
   npm run dev

## ⚙️ Контейнеризация
1. Убедитесь, что у вас установлен Docker и Docker Compose.
2. Запустите контейнер из корневой папки:
   ```bash
   docker-compose build
   docker-compose up
   ```
3. Перейдите в браузере по адресу `http://127.0.0.1:8000/` для доступа к backend и `http://localhost:3000/` для доступа к frontend.
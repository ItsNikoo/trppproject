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

## ⚙️ Установка

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
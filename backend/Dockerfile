# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Копируем requirements.txt и устанавливаем зависимости
COPY requirements.txt .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Копируем весь backend-код
COPY . .

# Команда запуска (пример для Django dev server)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

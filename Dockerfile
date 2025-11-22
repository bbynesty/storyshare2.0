# Dockerfile для C++ бэкенда на Render
FROM ubuntu:22.04

# Установка зависимостей
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    libboost-all-dev \
    && rm -rf /var/lib/apt/lists/*

# Установка Crow Framework
RUN git clone https://github.com/CrowCpp/Crow.git /tmp/crow && \
    cd /tmp/crow && \
    git checkout v1.0+5 && \
    mkdir -p /usr/local/include/crow && \
    cp include/*.h /usr/local/include/crow/

# Рабочая директория
WORKDIR /app

# Копирование файлов бэкенда
COPY backend/ ./backend/

# Сборка проекта
RUN mkdir -p backend/build && \
    cd backend/build && \
    cmake .. && \
    cmake --build . --config Release

# Открытие порта (Render использует переменную PORT)
# Используем переменную PORT или 8080 по умолчанию
EXPOSE 8080

# Запуск сервера
# Render автоматически устанавливает переменную PORT через окружение
# Убедитесь, что ваш сервер читает PORT из переменных окружения
CMD cd backend/build && PORT=${PORT:-8080} ./server


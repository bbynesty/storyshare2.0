# Dockerfile для C++ бэкенда на Render
FROM ubuntu:22.04

# Установка зависимостей
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    libboost-all-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Установка переменных окружения для компилятора
ENV CC=/usr/bin/gcc
ENV CXX=/usr/bin/g++

# Установка Crow Framework
# Клонируем репозиторий и устанавливаем заголовочные файлы
RUN git clone https://github.com/CrowCpp/Crow.git /tmp/crow && \
    cd /tmp/crow && \
    git checkout v1.0+5 && \
    mkdir -p /usr/local/include && \
    if [ -d "include/crow" ]; then \
        cp -r include/crow /usr/local/include/; \
    else \
        mkdir -p /usr/local/include/crow && \
        cp include/*.h /usr/local/include/crow/ 2>/dev/null || true; \
    fi && \
    ls -la /usr/local/include/crow/ || echo "Crow headers installed"

# Рабочая директория
WORKDIR /app

# Копирование файлов бэкенда
COPY backend/ ./backend/

# Сборка проекта
# На Linux не используется флаг --config, только на Windows
# Добавляем вывод для отладки
RUN mkdir -p backend/build && \
    cd backend/build && \
    echo "Checking Crow installation..." && \
    ls -la /usr/local/include/crow/ || echo "Crow not found in expected location" && \
    echo "Running CMake..." && \
    cmake -DCMAKE_BUILD_TYPE=Release .. 2>&1 | head -50 && \
    echo "Building project..." && \
    cmake --build . -- -j$(nproc) 2>&1 | tail -50

# Открытие порта (Render использует переменную PORT)
# Используем переменную PORT или 8080 по умолчанию
EXPOSE 8080

# Запуск сервера
# Render автоматически устанавливает переменную PORT через окружение
# Убедитесь, что ваш сервер читает PORT из переменных окружения
CMD cd backend/build && PORT=${PORT:-8080} ./server


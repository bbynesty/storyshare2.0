# Dockerfile для C++ бэкенда на Render
FROM ubuntu:22.04

# Установка зависимостей
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    libboost-system-dev \
    libboost-filesystem-dev \
    libssl-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Установка переменных окружения для компилятора
ENV CC=/usr/bin/gcc
ENV CXX=/usr/bin/g++

# Рабочая директория
WORKDIR /app

# Копирование файлов бэкенда
COPY backend/ ./backend/

# Установка Crow Framework в правильное место
# CMakeLists.txt ожидает Crow в backend/include/crow/include/
RUN mkdir -p backend/include/crow && \
    git clone https://github.com/CrowCpp/Crow.git /tmp/crow && \
    cd /tmp/crow && \
    git checkout v1.0+5 && \
    cp -r include/* /app/backend/include/crow/ && \
    echo "Crow installed to backend/include/crow/" && \
    ls -la /app/backend/include/crow/ | head -10

# Сборка проекта
# На Linux не используется флаг --config, только на Windows
WORKDIR /app/backend
RUN mkdir -p build && \
    cd build && \
    echo "=== Running CMake ===" && \
    cmake -DCMAKE_BUILD_TYPE=Release .. && \
    echo "=== Building project ===" && \
    cmake --build . -- -j$(nproc) && \
    echo "=== Checking for executable ===" && \
    ls -la server && \
    file server

# Открытие порта (Render использует переменную PORT)
EXPOSE 8080

# Запуск сервера
# Исполняемый файл должен быть в backend/build/server
WORKDIR /app/backend/build
CMD PORT=${PORT:-8080} ./server


# Используем официальный образ с C++ и CMake
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

# Установка рабочей директории
WORKDIR /app

# Копирование файлов проекта
COPY backend/ ./backend/

# Всегда используем последнюю версию Crow с поддержкой io_context
RUN echo "Installing latest Crow framework..." && \
    rm -rf /app/backend/include/crow && \
    mkdir -p /tmp && \
    cd /tmp && \
    git clone --depth 1 https://github.com/CrowCpp/Crow.git && \
    mkdir -p /app/backend/include/crow && \
    cp -r /tmp/Crow/include /app/backend/include/crow/ && \
    rm -rf /tmp/Crow && \
    echo "Crow framework installed successfully"

# Проверяем структуру перед сборкой
RUN echo "=== Verifying file structure ===" && \
    echo "Checking include directory:" && \
    ls -la /app/backend/include/ && \
    echo "Checking crow directory:" && \
    ls -la /app/backend/include/crow/ | head -5 && \
    echo "Checking crow/include directory:" && \
    ls -la /app/backend/include/crow/include/ | head -5 && \
    echo "Checking crow.h files:" && \
    find /app/backend/include -name "crow.h" -type f && \
    echo "Testing include path:" && \
    test -f /app/backend/include/crow/include/crow.h && echo "✓ crow/include/crow.h exists" || echo "✗ crow/include/crow.h MISSING"

# Сборка проекта
WORKDIR /app/backend
RUN mkdir -p build && \
    cd build && \
    cmake .. -DCMAKE_BUILD_TYPE=Release && \
    cmake --build . --config Release

# Открываем порт (Railway использует переменную PORT)
EXPOSE 8080

# Запуск сервера
WORKDIR /app/backend/build
CMD ["./server"]

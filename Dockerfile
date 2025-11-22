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

# Проверяем структуру перед сборкой
RUN echo "=== Verifying file structure ===" && \
    echo "Checking files:" && \
    ls -la /app/backend/include/ | head -10 && \
    echo "Checking crow.h:" && \
    test -f /app/backend/include/crow.h && echo "✓ crow.h exists" || echo "✗ crow.h missing" && \
    echo "Checking crow/include/crow.h:" && \
    test -f /app/backend/include/crow/include/crow.h && echo "✓ crow/include/crow.h exists" || echo "✗ crow/include/crow.h missing" && \
    echo "All crow.h files:" && \
    find /app/backend/include -name "crow.h" -type f

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

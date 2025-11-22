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

# Копирование файлов проекта (сначала копируем всё, чтобы сохранить структуру)
COPY backend/ ./backend/

# Проверяем структуру перед сборкой
RUN echo "=== Verifying file structure ===" && \
    echo "1. Checking main crow.h:" && \
    test -f /app/backend/include/crow.h && echo "   ✓ /app/backend/include/crow.h EXISTS" || echo "   ✗ MISSING" && \
    echo "2. Checking crow/include/crow.h:" && \
    test -f /app/backend/include/crow/include/crow.h && echo "   ✓ /app/backend/include/crow/include/crow.h EXISTS" || echo "   ✗ MISSING" && \
    echo "3. All crow.h files:" && \
    find /app/backend/include -name "crow.h" -type f && \
    echo "4. Testing include path resolution:" && \
    cd /app/backend/include && \
    test -f crow/include/crow.h && echo "   ✓ Path 'crow/include/crow.h' resolves correctly from include/" || echo "   ✗ Path resolution FAILED"

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


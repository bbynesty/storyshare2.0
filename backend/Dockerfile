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

# Проверяем структуру (для отладки)
RUN echo "=== Checking include structure ===" && \
    ls -la /app/backend/include/ && \
    echo "=== Checking crow directory ===" && \
    ls -la /app/backend/include/crow/ | head -10 && \
    echo "=== Checking crow/include ===" && \
    ls -la /app/backend/include/crow/include/ | head -10 && \
    echo "=== Checking crow/include/crow.h ===" && \
    test -f /app/backend/include/crow/include/crow.h && echo "crow.h found!" || echo "crow.h NOT found!"

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


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

# Установка Crow Framework в правильную структуру
# CMakeLists.txt ожидает: backend/include/crow/include/crow.h
RUN git clone https://github.com/CrowCpp/Crow.git /tmp/crow && \
    cd /tmp/crow && \
    git checkout v1.0+5 && \
    rm -rf /app/backend/include/crow && \
    mkdir -p /app/backend/include/crow && \
    cp -r include /app/backend/include/crow/ && \
    echo "Crow installed. Structure:" && \
    ls -la /app/backend/include/crow/include/ | head -10

# Сборка проекта
WORKDIR /app/backend
RUN mkdir -p build && \
    cd build && \
    cmake -DCMAKE_BUILD_TYPE=Release .. && \
    cmake --build . -j$(nproc) && \
    echo "=== Build completed ===" && \
    ls -lh server && \
    test -f server && echo "✓ Executable found" || echo "✗ Executable NOT found"

# Открытие порта
EXPOSE 8080

# Запуск сервера
WORKDIR /app/backend/build
CMD ["./server"]

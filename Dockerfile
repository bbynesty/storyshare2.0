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

ENV CC=/usr/bin/gcc
ENV CXX=/usr/bin/g++

WORKDIR /app

# Копирование файлов бэкенда
COPY backend/ ./backend/

# Установка Crow Framework
RUN git clone https://github.com/CrowCpp/Crow.git /tmp/crow
RUN cd /tmp/crow && git checkout v1.0+5
RUN rm -rf /app/backend/include/crow
RUN mkdir -p /app/backend/include/crow
RUN cp -r /tmp/crow/include /app/backend/include/crow/
RUN ls -la /app/backend/include/crow/include/ || true

# Сборка проекта
WORKDIR /app/backend
RUN mkdir -p build
WORKDIR /app/backend/build
RUN cmake -DCMAKE_BUILD_TYPE=Release ..
RUN cmake --build . -j$(nproc)
RUN test -f server && echo "Executable found" || (echo "Executable NOT found" && ls -la)

EXPOSE 8080

WORKDIR /app/backend/build
CMD ["./server"]

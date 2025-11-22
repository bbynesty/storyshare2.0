# Решение проблем с Docker сборкой

## Ошибка: CMake configuration failed

Если вы видите ошибку `Configuring incomplete, errors occurred!`, это означает, что CMake не может правильно настроить проект.

### Возможные причины и решения:

#### 1. Crow Framework не найден

**Симптомы:**
```
CMake Error: Could not find crow
```

**Решение:**
Убедитесь, что в вашем `backend/CMakeLists.txt` правильно указан путь к Crow. Возможные варианты:

```cmake
# Вариант 1: Если Crow установлен в системе
find_path(CROW_INCLUDE_DIR crow.h PATHS /usr/local/include/crow)

# Вариант 2: Если Crow в проекте
set(CROW_INCLUDE_DIR "${CMAKE_SOURCE_DIR}/../crow/include")

# Вариант 3: Использование FetchContent (рекомендуется)
include(FetchContent)
FetchContent_Declare(
    crow
    GIT_REPOSITORY https://github.com/CrowCpp/Crow.git
    GIT_TAG v1.0+5
)
FetchContent_MakeAvailable(crow)
```

#### 2. Неправильная структура проекта

**Проверьте структуру:**
```
backend/
  ├── CMakeLists.txt
  ├── src/
  │   └── main.cpp
  └── include/
```

#### 3. Проблемы с Boost

**Симптомы:**
```
Could not find Boost
```

**Решение:**
В Dockerfile уже установлен `libboost-all-dev`, но если проблема остается, добавьте в CMakeLists.txt:

```cmake
find_package(Boost REQUIRED COMPONENTS system filesystem)
```

#### 4. Проблемы с компилятором

**Симптомы:**
```
The CXX compiler identification is unknown
```

**Решение:**
Dockerfile уже устанавливает переменные `CC` и `CXX`. Если проблема остается, проверьте, что в Dockerfile есть:
```dockerfile
ENV CC=/usr/bin/gcc
ENV CXX=/usr/bin/g++
```

## Как отладить проблему

### 1. Проверьте логи сборки в Render

В панели Render откройте логи сборки и найдите строку с ошибкой CMake.

### 2. Локальная проверка Dockerfile

Соберите образ локально:
```bash
docker build -t storyshare-backend .
```

Это покажет полный вывод сборки.

### 3. Проверьте CMakeLists.txt

Убедитесь, что ваш `backend/CMakeLists.txt` содержит:

```cmake
cmake_minimum_required(VERSION 3.10)
project(StoryShareBackend)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Поиск Crow
find_path(CROW_INCLUDE_DIR 
    NAMES crow.h
    PATHS 
        /usr/local/include/crow
        /usr/include/crow
        ${CMAKE_SOURCE_DIR}/../crow/include
)

if(NOT CROW_INCLUDE_DIR)
    message(FATAL_ERROR "Crow not found! Please install Crow Framework.")
endif()

include_directories(${CROW_INCLUDE_DIR})

# Поиск Boost
find_package(Boost REQUIRED COMPONENTS system filesystem)
include_directories(${Boost_INCLUDE_DIRS})

# Исходные файлы
file(GLOB_RECURSE SOURCES "src/*.cpp" "src/*.h")

# Создание исполняемого файла
add_executable(server ${SOURCES})
target_link_libraries(server ${Boost_LIBRARIES})
```

## Альтернативные решения

### Вариант 1: Использовать альтернативный Dockerfile

Если основной Dockerfile не работает, попробуйте `Dockerfile.alternative`:

1. Переименуйте `Dockerfile` в `Dockerfile.original`
2. Переименуйте `Dockerfile.alternative` в `Dockerfile`
3. Пересоберите на Render

### Вариант 2: Использовать Crow как git submodule

1. Добавьте Crow как submodule:
```bash
cd backend
git submodule add https://github.com/CrowCpp/Crow.git crow
```

2. Обновите CMakeLists.txt для использования локального Crow:
```cmake
set(CROW_INCLUDE_DIR "${CMAKE_SOURCE_DIR}/crow/include")
```

### Вариант 3: Использовать FetchContent в CMakeLists.txt

Это самый надежный способ - CMake сам скачает Crow:

```cmake
include(FetchContent)
FetchContent_Declare(
    crow
    GIT_REPOSITORY https://github.com/CrowCpp/Crow.git
    GIT_TAG v1.0+5
)
FetchContent_MakeAvailable(crow)

# После этого используйте:
include_directories(${crow_SOURCE_DIR}/include)
```

## Полезные команды для отладки

### Проверка установки Crow в Docker
```bash
docker run -it <image> ls -la /usr/local/include/crow/
```

### Проверка структуры проекта
```bash
docker run -it <image> find /app/backend -type f -name "*.cpp" -o -name "*.h" -o -name "CMakeLists.txt"
```

### Ручной запуск CMake
```bash
docker run -it <image> bash
cd /app/backend/build
cmake .. -DCMAKE_BUILD_TYPE=Release
cmake --build .
```

## Если ничего не помогает

1. Проверьте, что ваш проект собирается локально на Linux
2. Убедитесь, что все зависимости указаны в CMakeLists.txt
3. Попробуйте использовать более простой подход - установить Crow через FetchContent в CMakeLists.txt вместо установки в Dockerfile


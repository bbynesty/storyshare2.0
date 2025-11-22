# Обновление бэкенда для работы с Render

## Проблема

Render автоматически устанавливает переменную окружения `PORT`, которую должен использовать ваш сервер. Если ваш C++ сервер жестко прописывает порт (например, `8080`), нужно обновить код.

## Решение

Обновите файл `backend/src/main.cpp` (или где у вас запускается сервер):

### Было (пример):
```cpp
int main()
{
    crow::SimpleApp app;
    
    // ... настройка роутов ...
    
    app.port(8080).multithreaded().run();
}
```

### Должно быть:
```cpp
#include <cstdlib>  // для getenv

int main()
{
    crow::SimpleApp app;
    
    // ... настройка роутов ...
    
    // Читаем PORT из переменных окружения, или используем 8080 по умолчанию
    const char* port_env = std::getenv("PORT");
    int port = port_env ? std::atoi(port_env) : 8080;
    
    app.port(port).multithreaded().run();
}
```

## Альтернативный вариант (если используете другой способ запуска):

```cpp
#include <cstdlib>
#include <string>

int main()
{
    crow::SimpleApp app;
    
    // ... настройка роутов ...
    
    // Получаем порт из окружения
    std::string port_str = std::getenv("PORT") ? std::getenv("PORT") : "8080";
    int port = std::stoi(port_str);
    
    CROW_LOG_INFO << "Starting server on port " << port;
    app.port(port).multithreaded().run();
}
```

## Проверка

После обновления кода:
1. Закоммитьте изменения
2. Push в GitHub
3. Render автоматически передеплоит сервис
4. Проверьте логи в Render - должен быть виден порт, на котором запустился сервер

## Примечание

Если ваш сервер уже читает PORT из окружения, ничего менять не нужно!


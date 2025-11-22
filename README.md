# StoryShare - Веб-приложение для обмена историями

Веб-приложение для создания, чтения и обмена историями с функционалом избранного и комментариев.

## Технологии
- **Frontend**: React + Material-UI
- **Backend**: C++ с Crow Framework

## Структура проекта
- `/backend` - C++ бэкенд
- `/frontend` - React фронтенд

## Требования
### Бэкенд
- C++17 или выше
- CMake 3.10 или выше
- Crow C++ web framework

### Фронтенд
- Node.js 14.0 или выше
- npm или yarn

## Установка и запуск локально

### Бэкенд
```bash
cd backend
mkdir build
cd build
cmake ..
cmake --build .
# Windows:
.\Debug\server.exe
# Linux/Mac:
./server
```

### Фронтенд
```bash
cd frontend
npm install
npm start
```

Сайт будет доступен на `http://localhost:3000`, сервер на `http://localhost:8080`

## Деплой на Vercel

### Настройки для Vercel:

1. Зайдите на [vercel.com](https://vercel.com)
2. Войдите через GitHub
3. Нажмите "Add New Project"
4. Выберите репозиторий `storyshare2.0`
5. **Важно!** В настройках проекта укажите:
   - **Root Directory**: `frontend``
   - **Framework Preset**: `Create React App` (или оставьте пустым)
   - **Build Command**: `npm run build` (или оставьте пустым - Vercel определит автоматически)
   - **Output Directory**: `build` (или оставьте пустым - Vercel определит автоматически)
   - **Install Command**: `npm install` (или оставьте пустым)
6. Нажмите "Deploy"

### Если Vercel не определяет фреймворк:

В настройках проекта (Settings → General):
- **Root Directory**: установите `frontend`
- **Build Command**: оставьте пустым или укажите `npm run build`
- **Output Directory**: оставьте пустым или укажите `build`
- **Install Command**: оставьте пустым или укажите `npm install`

Vercel автоматически определит Create React App, если `package.json` находится в корневой директории проекта (в нашем случае это `frontend/`).

## Деплой бэкенда (C++)

C++ бэкенд сложнее деплоить. Варианты:

#### Вариант 1: Heroku (с Buildpack)
1. Создайте аккаунт на [Heroku](https://heroku.com)
2. Установите Heroku CLI
3. В корне проекта создайте `Procfile`:
```
web: ./backend/build/Debug/server
```
4. Деплой:
```bash
heroku create ваш-проект
git push heroku main
```

#### Вариант 2: DigitalOcean / AWS / VPS
1. Арендуйте VPS сервер
2. Установите CMake и компилятор C++
3. Склонируйте репозиторий
4. Скомпилируйте и запустите сервер

#### Вариант 3: Переписать на Node.js (проще для деплоя)
Можно переписать бэкенд на Node.js/Express для более простого деплоя на Heroku, Railway, Render и т.д.

## Важные замечания

⚠️ **Данные хранятся в памяти** - при перезапуске сервера все данные (истории, пользователи) теряются. Для продакшена нужна база данных (SQLite, PostgreSQL и т.д.)

⚠️ **CORS настройки** - после деплоя измените CORS в `backend/src/main.cpp` на URL вашего фронтенда

⚠️ **API URL** - после деплоя фронтенда и бэкенда добавьте переменную окружения `REACT_APP_API_URL` в Vercel с URL вашего бэкенда

## Функционал
- ✅ Регистрация и вход пользователей
- ✅ Создание и редактирование историй
- ✅ Избранное (для каждого пользователя отдельно)
- ✅ Комментарии к историям
- ✅ Поиск историй
- ✅ Случайные цитаты

## Авторы
Ксения Калугина, Лейла Аббасова, Анастасия Гришанина

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

## Деплой на GitHub

### 1. Создание репозитория на GitHub

1. Зайдите на [GitHub.com](https://github.com)
2. Нажмите "New repository"
3. Назовите репозиторий (например, `storyshare`)
4. Выберите Public или Private
5. НЕ добавляйте README, .gitignore или лицензию (они уже есть)
6. Нажмите "Create repository"

### 2. Загрузка кода на GitHub

```bash
# В папке проекта (C:\Users\DAB\mysite)
git init
git add .
git commit -m "Initial commit: StoryShare project"
git branch -M main
git remote add origin https://github.com/ВАШ_НИКНЕЙМ/НАЗВАНИЕ_РЕПОЗИТОРИЯ.git
git push -u origin main
```

### 3. Деплой фронтенда (React)

#### Вариант 1: Netlify (рекомендуется)
1. Зайдите на [Netlify.com](https://netlify.com)
2. Войдите через GitHub
3. Нажмите "Add new site" → "Import an existing project"
4. Выберите ваш репозиторий
5. Настройки:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
6. Нажмите "Deploy site"
7. После деплоя измените `API_BASE_URL` в `frontend/src/api.js` на URL вашего бэкенда

#### Вариант 2: Vercel
1. Зайдите на [Vercel.com](https://vercel.com)
2. Войдите через GitHub
3. Импортируйте репозиторий
4. Настройки:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Нажмите "Deploy"

#### Вариант 3: GitHub Pages
1. В настройках репозитория → Pages
2. Source: GitHub Actions
3. Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install and Build
        run: |
          cd frontend
          npm install
          npm run build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/build
```

### 4. Деплой бэкенда (C++)

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

⚠️ **API URL** - после деплоя измените `API_BASE_URL` в `frontend/src/api.js` на URL вашего бэкенда

## Функционал
- ✅ Регистрация и вход пользователей
- ✅ Создание и редактирование историй
- ✅ Избранное (для каждого пользователя отдельно)
- ✅ Комментарии к историям
- ✅ Поиск историй
- ✅ Случайные цитаты

## Авторы
Ксения Калугина, Лейла Аббасова, Анастасия Гришанина 
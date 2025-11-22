# Быстрая инструкция по деплою на Render

## Шаг 1: Подготовка репозитория

Убедитесь, что в вашем репозитории есть:
- ✅ `Dockerfile` (для бэкенда)
- ✅ `render.yaml` (для автоматической настройки)
- ✅ `.dockerignore`

## Шаг 2: Деплой на Render

### Способ 1: Blueprint (самый простой)

1. Зайдите на [render.com](https://render.com) и войдите через GitHub
2. Нажмите **"New"** → **"Blueprint"**
3. Выберите репозиторий `bbynesty/storyshare2.0`
4. Render автоматически обнаружит `render.yaml` и создаст оба сервиса
5. Дождитесь завершения деплоя (5-10 минут)

### Способ 2: Ручная настройка

#### Бэкенд:
1. **New** → **Web Service**
2. Подключите репозиторий
3. Настройки:
   - Name: `storyshare-backend`
   - Environment: **Docker**
   - Dockerfile Path: `./Dockerfile`
   - Docker Context: `.`
4. Нажмите **Create Web Service**

#### Фронтенд:
1. **New** → **Static Site**
2. Подключите репозиторий
3. Настройки:
   - Name: `storyshare-frontend`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`
4. В Environment Variables добавьте:
   - `REACT_APP_API_URL` = URL вашего бэкенда (после его деплоя)
5. Нажмите **Create Static Site**

## Шаг 3: Настройка переменных окружения

После деплоя бэкенда:
1. Скопируйте URL бэкенда (например: `https://storyshare-backend.onrender.com`)
2. Откройте настройки фронтенда в Render
3. Перейдите в **Environment**
4. Обновите `REACT_APP_API_URL` на URL бэкенда
5. Сохраните и передеплойте фронтенд

## Важно!

⚠️ **Порт**: Убедитесь, что ваш C++ сервер читает переменную `PORT` из окружения. Если нет, нужно обновить код.

⚠️ **CORS**: После деплоя обновите CORS настройки в `backend/src/main.cpp`, добавив URL фронтенда.

⚠️ **Cold Start**: На бесплатном плане сервисы "засыпают" после 15 минут бездействия. Первый запрос может занять 30-50 секунд.

## Проверка

- Бэкенд: `https://your-backend.onrender.com`
- Фронтенд: `https://your-frontend.onrender.com`

## Проблемы?

Смотрите подробную инструкцию в `RENDER_DEPLOY.md`


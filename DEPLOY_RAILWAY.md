# Деплой бэкенда на Railway (для Vercel фронтенда)

## Быстрая инструкция

### 1. Задеплой бэкенд на Railway:

1. Зайди на [railway.app](https://railway.app)
2. Войди через GitHub
3. Нажми **"New Project"** → **"Deploy from GitHub repo"**
4. Выбери репозиторий `storyshare2.0`
5. Railway автоматически найдет `Dockerfile` в корне проекта
6. Дождись завершения деплоя (5-10 минут)
7. После деплоя получишь URL типа: `https://your-app.railway.app`

### 2. (Опционально) Настрой CORS в Railway:

Если хочешь ограничить доступ только с твоего Vercel домена:
1. В Railway открой проект → **Variables**
2. Добавь переменную:
   - **Name**: `CORS_ORIGIN`
   - **Value**: `https://your-vercel-app.vercel.app` (твой Vercel URL)
3. Нажми **Save**

**Если не добавишь эту переменную** - бэкенд будет работать со всеми доменами (что нормально для теста).

### 3. Подключи бэкенд к Vercel:

1. Зайди на [vercel.com](https://vercel.com)
2. Открой свой проект (фронтенд)
3. Перейди в **Settings** → **Environment Variables**
4. Добавь новую переменную:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://your-app.railway.app` (URL из Railway, БЕЗ слеша в конце!)
   - **Environment**: выбери все (Production, Preview, Development)
5. Нажми **Save**
6. Перейди в **Deployments** → нажми **"..."** на последнем деплое → **Redeploy**

### 4. Готово! 

Сайт должен работать. Фронтенд на Vercel будет обращаться к бэкенду на Railway.

---

## Если что-то не работает:

1. **Проверь логи Railway**: 
   - В Railway открой проект → **Deployments** → выбери последний деплой → смотри логи
   - Ищи ошибки компиляции или запуска

2. **Проверь переменные окружения в Vercel**: 
   - Убедись, что `REACT_APP_API_URL` установлена
   - Убедись, что URL правильный (без `/` в конце, с `https://`)

3. **Проверь CORS**: 
   - Открой консоль браузера (F12) → вкладка Network
   - Смотри ошибки типа "CORS policy" или "blocked by CORS"
   - Если есть ошибки - добавь переменную `CORS_ORIGIN` в Railway

4. **Проверь, что сервер запущен**:
   - В Railway → **Deployments** → последний деплой должен быть зеленым
   - Если красный - смотри логи

---

## Примеры URL:

- Railway бэкенд: `https://storyshare-backend.railway.app`
- Vercel фронтенд: `https://storyshare.vercel.app`

В Vercel переменная `REACT_APP_API_URL` = `https://storyshare-backend.railway.app`


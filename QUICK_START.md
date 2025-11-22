# Быстрый запуск сайта

## Локальный запуск (самый быстрый способ)

### 1. Запустить сервер:
Дважды кликни на файл `start-server.bat` в корне проекта
ИЛИ в PowerShell:
```powershell
cd backend\build\Debug
.\server.exe
```

### 2. Запустить фронтенд:
Дважды кликни на файл `start-frontend.bat` в корне проекта
ИЛИ в PowerShell:
```powershell
cd frontend
npm start
```

Сайт будет доступен на: **http://localhost:3000**
Сервер работает на: **http://localhost:8080**

---

## Деплой на Railway (для публичного доступа)

### Шаги:
1. Зайди на [railway.app](https://railway.app)
2. Войди через GitHub
3. Нажми "New Project" → "Deploy from GitHub repo"
4. Выбери репозиторий `storyshare2.0`
5. Railway автоматически найдет `Dockerfile` в корне
6. После деплоя получишь URL типа `https://your-app.railway.app`
7. В Vercel (где задеплоен фронтенд) добавь переменную окружения:
   - `REACT_APP_API_URL` = `https://your-app.railway.app`

Готово! Сайт будет работать публично.


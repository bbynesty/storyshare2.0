# Варианты деплоя C++ бэкенда

## 1. Railway (Рекомендуется для C++)

**Плюсы:**
- ✅ Отличная поддержка Docker
- ✅ Бесплатный план с $5 кредитами в месяц
- ✅ Автоматический деплой из GitHub
- ✅ Простая настройка

**Минусы:**
- ⚠️ Ограниченные бесплатные кредиты

**Настройка:**

1. Зайдите на [railway.app](https://railway.app)
2. Войдите через GitHub
3. Нажмите "New Project" → "Deploy from GitHub repo"
4. Выберите репозиторий `bbynesty/storyshare2.0`
5. Railway автоматически обнаружит `railway.json` и Dockerfile
6. Добавьте переменную окружения `PORT` (Railway установит автоматически)

**Файл `railway.json` уже есть в проекте!**

---

## 2. Fly.io

**Плюсы:**
- ✅ Отличная поддержка Docker
- ✅ Бесплатный план (3 shared-cpu-1x VMs)
- ✅ Глобальная сеть (близко к пользователям)
- ✅ Простой CLI

**Минусы:**
- ⚠️ Нужно установить CLI для первого деплоя

**Настройка:**

1. Установите Fly CLI:
```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex
```

2. Войдите:
```bash
fly auth login
```

3. Создайте приложение:
```bash
fly launch --name storyshare-backend
```

4. Fly автоматически обнаружит Dockerfile и задеплоит

**Создать `fly.toml` (опционально):**
```toml
app = "storyshare-backend"
primary_region = "iad"

[build]

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[services]]
  protocol = "tcp"
  internal_port = 8080
```

---

## 3. DigitalOcean App Platform

**Плюсы:**
- ✅ Хорошая поддержка Docker
- ✅ Простой интерфейс
- ✅ $5/месяц за базовый план

**Минусы:**
- ⚠️ Платный (но дешевый)

**Настройка:**

1. Зайдите на [digitalocean.com](https://digitalocean.com)
2. App Platform → Create App
3. Подключите GitHub репозиторий
4. Выберите Docker
5. Укажите Dockerfile путь: `./Dockerfile`
6. Добавьте переменную `PORT`

---

## 4. Heroku

**Плюсы:**
- ✅ Популярная платформа
- ✅ Много документации

**Минусы:**
- ⚠️ Убрали бесплатный план
- ⚠️ Нужен buildpack для C++

**Настройка:**

1. Установите Heroku CLI
2. Создайте `Procfile`:
```
web: cd backend/build && ./server
```

3. Создайте `app.json`:
```json
{
  "buildpacks": [
    {
      "url": "https://github.com/heroku/heroku-buildpack-apt"
    },
    {
      "url": "heroku-community/cmake"
    }
  ]
}
```

4. Деплой:
```bash
heroku create storyshare-backend
git push heroku main
```

---

## 5. AWS (EC2 / ECS / App Runner)

**Плюсы:**
- ✅ Мощная инфраструктура
- ✅ Масштабируемость

**Минусы:**
- ⚠️ Сложная настройка
- ⚠️ Платно (но есть free tier)

**Варианты:**
- **EC2**: VPS сервер (сложнее, но полный контроль)
- **ECS**: Docker контейнеры (проще)
- **App Runner**: Автоматический деплой из Docker (самый простой)

---

## 6. Google Cloud Run

**Плюсы:**
- ✅ Отличная поддержка Docker
- ✅ Платите только за использование
- ✅ Автоматическое масштабирование

**Минусы:**
- ⚠️ Нужна карта для аккаунта (но есть free tier)

**Настройка:**

1. Установите Google Cloud CLI
2. Создайте проект:
```bash
gcloud projects create storyshare-backend
gcloud config set project storyshare-backend
```

3. Деплой:
```bash
gcloud run deploy storyshare-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 7. VPS (DigitalOcean Droplet, Linode, Vultr)

**Плюсы:**
- ✅ Полный контроль
- ✅ Дешево ($5-10/месяц)
- ✅ Можно использовать как угодно

**Минусы:**
- ⚠️ Нужно настраивать самому
- ⚠️ Нужно следить за безопасностью

**Настройка:**

1. Арендуйте VPS
2. Установите Docker:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

3. Склонируйте репозиторий
4. Соберите и запустите:
```bash
docker build -t storyshare-backend .
docker run -d -p 8080:8080 --name storyshare storyshare-backend
```

5. Настройте nginx для проксирования (опционально)

---

## Рекомендации

### Для быстрого старта:
1. **Railway** — самый простой, хорошая поддержка Docker
2. **Fly.io** — бесплатный, хорошая производительность

### Для продакшена:
1. **DigitalOcean App Platform** — баланс цены и удобства
2. **Google Cloud Run** — масштабируемость
3. **VPS** — полный контроль, дешево

### Для обучения:
1. **VPS** — научитесь настраивать серверы
2. **AWS/GCP** — изучите облачные платформы

---

## Сравнение

| Платформа | Бесплатный план | Сложность | Docker | Рекомендация |
|-----------|----------------|-----------|--------|--------------|
| Railway | $5 кредитов/мес | ⭐ Легко | ✅ | ⭐⭐⭐⭐⭐ |
| Fly.io | 3 VM бесплатно | ⭐⭐ Средне | ✅ | ⭐⭐⭐⭐⭐ |
| Render | Есть (sleep) | ⭐ Легко | ✅ | ⭐⭐⭐⭐ |
| DigitalOcean | Нет | ⭐⭐ Средне | ✅ | ⭐⭐⭐⭐ |
| Heroku | Нет | ⭐⭐ Средне | ⚠️ | ⭐⭐ |
| Cloud Run | Free tier | ⭐⭐⭐ Сложно | ✅ | ⭐⭐⭐⭐ |
| VPS | Нет | ⭐⭐⭐⭐ Очень сложно | ✅ | ⭐⭐⭐ |

---

## Быстрый старт с Railway

Railway — самый простой вариант после Render:

1. Зайдите на [railway.app](https://railway.app)
2. Войдите через GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Выберите `bbynesty/storyshare2.0`
5. Готово! Railway автоматически использует `railway.json` и Dockerfile

**Файл `railway.json` уже настроен в вашем проекте!**


# Развёртывание сайта «Анор»

## Важно про выбор хостинга

Сайт использует **SQLite** (файл базы `*.db`) и хранит **фотографии блюд** в
папке `public/uploads`. И база, и фото — это **файлы на диске**. Поэтому нужен
хостинг с **постоянным диском** (persistent storage):

- ✅ **VPS** (обычный сервер: Timeweb, Selectel, Beget, REG.RU, Hetzner и т.п.) —
  рекомендуется, инструкция ниже.
- ✅ **Railway / Render** — подойдёт, если подключить постоянный том (volume).
- ⚠️ **Vercel / Netlify (serverless)** — **не подойдут как есть**: там файловая
  система временная, база и загруженные фото будут теряться. Для Vercel нужно
  перейти на PostgreSQL и хранилище картинок (S3). См. раздел в конце.

Ниже — основной сценарий на **VPS с Ubuntu**.

---

## Вариант A. VPS (Ubuntu) — рекомендуется

### 1. Подготовка сервера
Подключитесь к серверу по SSH и установите Node.js 20+ и git:
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs git
node -v   # должно быть v22.x
```

### 2. Загрузка проекта
```bash
cd /var/www            # или любая папка
git clone <URL_вашего_репозитория> anor
cd anor
```
(Если репозитория нет — просто скопируйте папку проекта на сервер, например
через `scp`.)

### 3. Настройка переменных окружения
Создайте файл `.env` (можно из шаблона `.env.example`):
```bash
cp .env.example .env
nano .env
```
Заполните:
```
DATABASE_URL="file:./prod.db"
ADMIN_USERNAME="ваш_логин"
ADMIN_PASSWORD="надёжный_пароль"
SESSION_SECRET="длинная-случайная-строка"
NEXT_PUBLIC_RESTAURANT_NAME="Анор"
```
Секрет удобно сгенерировать:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Установка, миграции, сборка
```bash
npm install
npx prisma migrate deploy   # создаёт таблицы в prod.db
npm run db:seed             # (необязательно) залить тестовое меню
npm run build               # продакшен-сборка
```

### 5. Запуск через PM2 (чтобы сайт работал постоянно)
```bash
sudo npm install -g pm2
pm2 start "npm run start" --name anor
pm2 save
pm2 startup            # выполните команду, которую покажет PM2
```
Сайт поднимется на `http://<IP_сервера>:3000`.

Полезные команды PM2: `pm2 logs anor`, `pm2 restart anor`, `pm2 stop anor`.

### 6. Домен и HTTPS (Nginx + Let's Encrypt)
Установите Nginx:
```bash
sudo apt-get install -y nginx
```
Создайте конфиг `/etc/nginx/sites-available/anor`:
```nginx
server {
    server_name ваш-домен.ru www.ваш-домен.ru;
    client_max_body_size 16M;  # чтобы проходила загрузка фото

    # Раздаём загруженные фото напрямую (Next.js не отдаёт файлы,
    # добавленные в public/ после сборки).
    location /uploads/ {
        alias /var/www/anor/public/uploads/;
        access_log off;
        expires 30d;
        try_files $uri =404;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Включите сайт и получите бесплатный SSL-сертификат:
```bash
sudo ln -s /etc/nginx/sites-available/anor /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru
```
Certbot сам добавит HTTPS и продление сертификата.

> Заголовок `X-Forwarded-For` из конфига Nginx нужен, чтобы правильно работала
> защита админки от подбора пароля (блокировка по IP).

### 7. Обновление сайта в будущем
```bash
cd /var/www/anor
git pull                    # или заново скопируйте файлы
npm install
npx prisma migrate deploy   # применит новые миграции, если есть
npm run build
pm2 restart anor
```

---

## Резервные копии (обязательно!)

Важные данные — это **файл базы** и **папка с фото**. Регулярно копируйте:
```bash
cp prod.db /путь/для/бэкапов/prod-$(date +%F).db
tar czf /путь/для/бэкапов/uploads-$(date +%F).tgz public/uploads
```
Можно поставить это в `cron` (например, ежедневно).

---

## Вариант B. Railway / Render (кратко)

1. Подключите репозиторий.
2. Команда сборки: `npm install && npx prisma migrate deploy && npm run build`.
3. Команда запуска: `npm run start`.
4. Задайте переменные окружения (как в разделе 3).
5. **Подключите постоянный том (Persistent Volume)** и смонтируйте его так,
   чтобы на нём лежали файл базы и папка `public/uploads` — иначе данные
   пропадут при перезапуске.

---

## Если нужен именно Vercel (serverless)

Тогда потребуются доработки (это отдельный этап):
- перейти с SQLite на **PostgreSQL** (например, Neon, Supabase, Vercel Postgres)
  — поменять `provider` и адаптер в Prisma;
- хранить фотографии не в `public/uploads`, а во внешнем хранилище
  (**S3 / Vercel Blob**) — переписать загрузку в `src/app/api/admin/upload`.

Скажите, если выберете этот путь — помогу с переносом.

---

## Частые вопросы

- **Какой порт?** Приложение слушает `3000`. Наружу отдаём через Nginx на 80/443.
- **Изменить логин/пароль админа?** Отредактируйте `.env` и `pm2 restart anor`.
- **Node какой версии?** 18+, проверялось на 22.
- **Где база после деплоя?** Файл `prod.db` в корне проекта (путь из
  `DATABASE_URL`).

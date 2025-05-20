# Генератор текстов песен

Веб-приложение для генерации текстов песен с использованием шаблонов и Hugging Face API.

## Особенности

- Выбор жанра (рэп, поп, рок)
- Выбор настроения (грустный, веселый, агрессивный)
- Ввод основной идеи/темы
- Генерация рифмованного текста
- Копирование и экспорт результата
- Сохранение истории генераций
- Редактирование сгенерированного текста
- Система рейтинга качества текстов
- Темная/светлая тема

## Технологии

- Next.js (TypeScript)
- Tailwind CSS
- Supabase (база данных и аутентификация)
- Hugging Face Inference API (бесплатная генерация текста)

## Установка и запуск

1. Клонировать репозиторий:
   ```
   git clone <url-репозитория>
   cd <название-папки>
   ```

2. Установить зависимости:
   ```
   pnpm install
   ```

3. Создать файл `.env.local` со следующими переменными:
   ```
   NEXT_PUBLIC_SUPABASE_URL=ваш_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_ключ_supabase
   HUGGINGFACE_API_TOKEN=ваш_токен_huggingface
   ```

   > Примечание: Токен Hugging Face не обязателен. Без него приложение будет использовать локальную генерацию текста на основе шаблонов.

4. Создать таблицу в Supabase:
   ```sql
   CREATE TABLE song_history (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     genre TEXT NOT NULL,
     mood TEXT NOT NULL,
     theme TEXT NOT NULL,
     text TEXT NOT NULL,
     rating INTEGER,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

5. Запустить проект:
   ```
   pnpm dev
   ```

6. Открыть [http://localhost:3000](http://localhost:3000) в браузере.

## Использование без API

Приложение полностью функционально даже без API ключа Hugging Face. В этом случае используется локальная генерация текста на основе шаблонов для каждого жанра и настроения.

Если вы хотите использовать Hugging Face API для более качественной генерации:

1. Зарегистрируйтесь на [Hugging Face](https://huggingface.co/)
2. Получите бесплатный API токен в [настройках аккаунта](https://huggingface.co/settings/tokens)
3. Добавьте токен в файл `.env.local`

## Лицензия

MIT

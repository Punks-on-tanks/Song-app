import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { genre, mood, theme } = await request.json()

    // Создаем промпт для генерации
    const prompt = `Сгенерируй ${mood} текст песни в жанре ${genre} на тему "${theme}".
    Текст должен быть рифмованным и содержать припев и куплеты.
    Максимальная длина текста - 1000 символов.
    Текст должен быть на русском языке.`

    // Проверяем наличие API ключа для Hugging Face
    const huggingFaceToken = process.env.HUGGINGFACE_API_TOKEN

    // Если нет ключа или мы в режиме разработки, используем локальную генерацию
    if (!huggingFaceToken || process.env.NODE_ENV === 'development') {
      // Локальная генерация текста без API
      const generatedText = generateLocalLyrics(genre, mood, theme)
      return NextResponse.json({ text: generatedText })
    }

    // Вызов Hugging Face Inference API (бесплатный)
    try {
      // Используем модель для русского языка, например, "IlyaGusev/rugpt3medium_sum_gazeta"
      const response = await fetch(
        "https://api-inference.huggingface.co/models/IlyaGusev/rugpt3medium_sum_gazeta",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${huggingFaceToken}`
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_length: 1000,
              temperature: 0.7,
              top_p: 0.9,
              do_sample: true
            }
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()

      // Hugging Face возвращает сгенерированный текст в разных форматах в зависимости от модели
      let generatedText = ""

      if (Array.isArray(data) && data.length > 0) {
        // Некоторые модели возвращают массив с объектами
        generatedText = data[0].generated_text || ""
      } else if (typeof data === 'object' && data.generated_text) {
        // Некоторые модели возвращают объект с полем generated_text
        generatedText = data.generated_text
      } else if (typeof data === 'string') {
        // Некоторые модели возвращают просто строку
        generatedText = data
      }

      // Форматируем текст, если он не содержит разделов
      if (!generatedText.includes("Куплет") && !generatedText.includes("Припев")) {
        generatedText = formatLyrics(generatedText, genre, theme)
      }

      return NextResponse.json({ text: generatedText })
    } catch (apiError) {
      console.error('API error:', apiError)
      // В случае ошибки API, используем локальную генерацию
      const generatedText = generateLocalLyrics(genre, mood, theme)
      return NextResponse.json({ text: generatedText })
    }
  } catch (error) {
    console.error('Error generating text:', error)
    return NextResponse.json(
      { error: 'Failed to generate text' },
      { status: 500 }
    )
  }
}

// Функция для локальной генерации текста песни без использования API
function generateLocalLyrics(genre: string, mood: string, theme: string): string {
  // Шаблоны для разных жанров
  const templates = {
    rap: {
      happy: [
        "Новый день, новый шанс, мы на волне успеха",
        "Позитив в каждом слове, это не помеха",
        "Движемся вперёд, не зная преград",
        "Каждый миг ценен, каждый успеху рад"
      ],
      sad: [
        "В тишине ночи ищу ответы на вопросы",
        "Память хранит моменты, но они разбросаны",
        "Сквозь туман мыслей пробиваюсь к свету",
        "Но тяжесть на душе не даёт найти просвету"
      ],
      aggressive: [
        "Бит разрывает колонки, слова как пули",
        "Мы не отступим, даже если нас обманули",
        "Сила в правде, а правда в каждом из нас",
        "Это не просто рифмы, это жизненный сказ"
      ]
    },
    pop: {
      happy: [
        "Яркие краски наполняют этот мир",
        "Музыка громче, это наш ориентир",
        "Танцуй со мной до утра, забудь про всё",
        "Этот момент навсегда, он только твоё"
      ],
      sad: [
        "Дождь за окном напоминает о тебе",
        "Воспоминания тают в серебряной воде",
        "Мелодия грусти звучит в тишине",
        "Я вспоминаю о нас, о тебе и о мне"
      ],
      aggressive: [
        "Разбивая стереотипы, иду напролом",
        "Не важно, что скажут, мой путь освещён",
        "Громче музыка, ярче свет",
        "На вопросы судьбы найду я ответ"
      ]
    },
    rock: {
      happy: [
        "Гитарный рифф зажигает толпу",
        "Мы вместе создаём эту мечту",
        "Руки вверх, громче крик",
        "Этот момент счастья не забыть"
      ],
      sad: [
        "Струны гитары плачут вместе со мной",
        "Тяжесть аккордов, разговор с тишиной",
        "Сквозь боль и потери ищу я путь",
        "Музыка лечит, позволяет вздохнуть"
      ],
      aggressive: [
        "Мощный звук разрывает тишину",
        "Бунт против системы, я не утону",
        "Гитарный рифф как крик души",
        "Мы здесь, чтобы правду до вас донести"
      ]
    }
  }

  // Выбираем шаблоны для указанного жанра и настроения
  const genreTemplates = templates[genre as keyof typeof templates] || templates.pop
  const moodVerses = genreTemplates[mood as keyof typeof genreTemplates] || genreTemplates.happy

  // Создаем припев на основе темы
  const chorus = [
    `${theme} - это то, что нас объединяет`,
    `${theme} - в этом сила и наша правда`,
    `Снова и снова мы возвращаемся к этому`,
    `${theme} - это наш путь, наша история`
  ]

  // Формируем текст песни
  return `
# ${genre.toUpperCase()} - ${theme}

## Куплет 1
${moodVerses[0]}
${moodVerses[1]}
${theme} всегда в моих мыслях
Это больше чем слова, это часть моей жизни

## Припев
${chorus[0]}
${chorus[1]}
${chorus[2]}
${chorus[3]}

## Куплет 2
${moodVerses[2]}
${moodVerses[3]}
${theme} - это то, что даёт мне силы
Через все испытания, через все мили

## Припев
${chorus[0]}
${chorus[1]}
${chorus[2]}
${chorus[3]}

## Куплет 3
Каждый день новая страница
${theme} помогает мне не останавливаться
В ${mood} настроении продолжаю путь
${genre} музыка даёт возможность вздохнуть
  `
}

// Функция для форматирования сырого текста в структуру песни
function formatLyrics(rawText: string, genre: string, theme: string): string {
  // Разбиваем текст на строки
  const lines = rawText.split('\n').filter(line => line.trim().length > 0)

  // Если текст слишком короткий, используем локальную генерацию
  if (lines.length < 8) {
    return generateLocalLyrics(genre, 'happy', theme)
  }

  // Формируем структуру песни
  const formattedText = `
# ${genre.toUpperCase()} - ${theme}

## Куплет 1
${lines.slice(0, 4).join('\n')}

## Припев
${lines.slice(4, 8).join('\n')}

## Куплет 2
${lines.slice(8, 12).join('\n')}

## Припев
${lines.slice(4, 8).join('\n')}
  `

  return formattedText
}

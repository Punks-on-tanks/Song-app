import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { genre, mood, theme } = await request.json()

    // Создаем улучшенный промпт для генерации с акцентом на рифму
    const prompt = `Сгенерируй оригинальный ${mood} текст песни в жанре ${genre} на тему "${theme}".
    Текст должен быть сильно рифмованным, с чередованием рифм (AABB или ABAB).
    Обязательно включи яркие метафоры и образы, связанные с темой "${theme}".
    Структура: 2 куплета по 4 строки, припев из 4 строк, и третий куплет из 4 строк.
    Каждая строка должна быть ритмичной и подходить для исполнения.
    Текст должен быть уникальным, не похожим на шаблонные песни.
    Максимальная длина текста - 1000 символов.
    Текст должен быть на русском языке.`

    // Проверяем наличие API ключа для Hugging Face
    const huggingFaceToken = process.env.HUGGINGFACE_API_TOKEN

    // Если нет ключа или он пустой, используем локальную генерацию
    if (!huggingFaceToken || huggingFaceToken.trim() === '') {
      console.log('Using local lyrics generation (no API token)')
      const generatedText = generateLocalLyrics(genre, mood, theme)
      return NextResponse.json({ text: generatedText })
    }

    // Вызов Hugging Face Inference API (бесплатный)
    try {
      console.log('Attempting to use Hugging Face API')

      // Используем модель для русского языка с открытым доступом
      // Заменяем на модель, которая не требует токена или имеет более широкий доступ
      const response = await fetch(
        "https://api-inference.huggingface.co/models/ai-forever/rugpt3large_based_on_gpt2",
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
              do_sample: true,
              return_full_text: false
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
  // Расширенные шаблоны для разных жанров с улучшенной рифмой
  const templates = {
    rap: {
      happy: [
        "Новый день, новый шанс, на волне успеха мы летим",
        "Позитив в каждом слове, негативу не дадим",
        "Движемся вперёд, не зная преград и сомнений",
        "Каждый миг ценен, полон ярких впечатлений",
        "Рифмы льются потоком, как весенняя река",
        "Музыка в наших сердцах будет жить века",
        "Солнце светит ярко, освещая путь вперёд",
        "Этот ритм заставляет двигаться народ"
      ],
      sad: [
        "В тишине ночи ищу ответы на вопросы свои",
        "Память хранит моменты, но они как миражи",
        "Сквозь туман мыслей пробиваюсь к свету надежды",
        "Но тяжесть на душе не даёт мне быть прежним",
        "Дождь за окном барабанит, как мысли в голове",
        "Слова на бумаге — единственный выход в темноте",
        "Время лечит раны, но шрамы остаются навсегда",
        "В каждой строчке боль, в каждом слове — правда"
      ],
      aggressive: [
        "Бит разрывает колонки, слова как пули летят",
        "Мы не отступим, даже если нас предадут",
        "Сила в правде, а правда в каждом из нас живёт",
        "Это не просто рифмы, это жизненный оплот",
        "Громче звук, сильнее бас, мы разрушаем стены",
        "Каждый куплет — как выстрел, мы не знаем измены",
        "Улицы научили нас выживать и бороться",
        "Этот трек — как оружие, что в сердце колется"
      ]
    },
    pop: {
      happy: [
        "Яркие краски наполняют этот мир вокруг нас",
        "Музыка громче, это наш звёздный час",
        "Танцуй со мной до утра, забудь про всё плохое",
        "Этот момент навсегда, он только наше, родное",
        "Лето в сердце, даже если за окном зима",
        "Эта мелодия сводит с ума, сводит с ума",
        "Держи мою руку и просто лети со мной",
        "В этом ритме найдём мы вечный покой"
      ],
      sad: [
        "Дождь за окном напоминает о тебе, о нас",
        "Воспоминания тают в серебряной воде сейчас",
        "Мелодия грусти звучит в тишине пустой квартиры",
        "Я вспоминаю о нас, о моменты счастья, что были милы",
        "Фотографии хранят улыбки, что больше не вернуть",
        "Песня о тебе — мой единственный путь",
        "Время не лечит, лишь учит жить с этой болью",
        "Твой голос в голове, как шёпот прибоя"
      ],
      aggressive: [
        "Разбивая стереотипы, иду напролом сквозь толпу",
        "Не важно, что скажут, свой путь я найду",
        "Громче музыка, ярче свет прожекторов",
        "На вопросы судьбы у меня готов ответ суровый",
        "Маски сброшены, правда как она есть",
        "В этом мире фальши моя песня — честь",
        "Бит сильнее, голос громче, это мой манифест",
        "Я не сдамся, даже если весь мир против, это протест"
      ]
    },
    rock: {
      happy: [
        "Гитарный рифф зажигает толпу, как искра пламя",
        "Мы вместе создаём эту мечту, держим знамя",
        "Руки вверх, громче крик, это наш момент",
        "Этот вечер счастья не забыть, как первый комплимент",
        "Адреналин в крови, свобода в каждом аккорде",
        "Эта музыка — наш гимн, мы с ней в одном полёте",
        "Сцена дрожит от звука наших сердец",
        "В этом ритме мы найдём жизни венец"
      ],
      sad: [
        "Струны гитары плачут вместе со мной в ночи",
        "Тяжесть аккордов, разговор с тишиной звучит",
        "Сквозь боль и потери ищу я путь к свету",
        "Музыка лечит, даёт силы жить по завету",
        "Осколки прошлого режут память до крови",
        "В каждой ноте история несбывшейся любви",
        "Дым сигарет, пустые бутылки — декорации печали",
        "Мы были так близки, но друг друга не узнали"
      ],
      aggressive: [
        "Мощный звук разрывает тишину, как гром небеса",
        "Бунт против системы, я не утону, вот моя полоса",
        "Гитарный рифф как крик души, рвущийся наружу",
        "Мы здесь, чтобы правду до вас донести, разрушить стужу",
        "Стены дрожат от мощи наших слов",
        "Это не просто музыка, это наш зов",
        "Против течения, против правил и запретов",
        "Наш рок — это свобода, без границ и без билетов"
      ]
    }
  }

  // Функция для случайного выбора строк из массива
  const getRandomLines = (lines: string[], count: number) => {
    const shuffled = [...lines].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Выбираем шаблоны для указанного жанра и настроения
  const genreTemplates = templates[genre as keyof typeof templates] || templates.pop;
  const moodVerses = genreTemplates[mood as keyof typeof genreTemplates] || genreTemplates.happy;

  // Создаем более разнообразные и рифмованные припевы на основе темы
  const chorusTemplates = [
    [
      `${theme} - в каждом вздохе, в каждом слове моём`,
      `${theme} - это пламя, что горит день за днём`,
      `Снова и снова к этому возвращаюсь я`,
      `${theme} - это путь мой, моя история`
    ],
    [
      `Когда ${theme} в сердце живёт, не страшна беда`,
      `Этот огонь не погаснет никогда`,
      `Сквозь года пронесу я эту веру с собой`,
      `${theme} даёт силы, дарит душе покой`
    ],
    [
      `${theme} как воздух нужно мне каждый день`,
      `Это не просто слово, это жизни моей стержень`,
      `Без этого нет смысла, нет пути вперёд`,
      `${theme} - это то, что меня вечно ведёт`
    ]
  ];

  // Выбираем случайный шаблон припева
  const chorusIndex = Math.floor(Math.random() * chorusTemplates.length);
  const chorus = chorusTemplates[chorusIndex];

  // Создаем уникальные строки для куплетов на основе темы
  const customLines = [
    `${theme} в моих мыслях, как звезда в ночном небе`,
    `Это больше чем слова, это часть моей судьбы`,
    `С ${theme} я познал, что значит настоящая жизнь`,
    `Каждый день новый шаг, ${theme} указывает путь`,
    `${theme} - это то, что даёт мне силы не сдаваться`,
    `Через все испытания, через все преграды вместе`,
    `В ${mood} настроении продолжаю свой путь к мечте`,
    `${genre} музыка в сердце, ${theme} в душе навсегда`
  ];

  // Формируем текст песни с большим разнообразием
  return `
# ${genre.toUpperCase()} - ${theme}

## Куплет 1
${getRandomLines(moodVerses, 2).join('\n')}
${getRandomLines(customLines, 2).join('\n')}

## Припев
${chorus[0]}
${chorus[1]}
${chorus[2]}
${chorus[3]}

## Куплет 2
${getRandomLines(moodVerses, 2).join('\n')}
${getRandomLines(customLines, 2).join('\n')}

## Припев
${chorus[0]}
${chorus[1]}
${chorus[2]}
${chorus[3]}

## Куплет 3
${getRandomLines(moodVerses, 2).join('\n')}
${getRandomLines(customLines, 2).join('\n')}
  `
}

// Функция для форматирования сырого текста в структуру песни
function formatLyrics(rawText: string, genre: string, theme: string): string {
  // Разбиваем текст на строки
  const lines = rawText.split('\n').filter(line => line.trim().length > 0)

  // Если текст слишком короткий, используем локальную генерацию
  if (lines.length < 12) {
    return generateLocalLyrics(genre, 'happy', theme)
  }

  // Функция для добавления рифмы к строкам
  const enhanceRhymes = (textLines: string[]) => {
    // Простые рифмующиеся окончания
    const rhymePairs = [
      ['ать', 'дать'], ['ить', 'быть'], ['ать', 'знать'],
      ['ой', 'мой'], ['ет', 'свет'], ['ать', 'стать'],
      ['ой', 'покой'], ['ать', 'ждать'], ['ить', 'жить'],
      ['ать', 'сказать'], ['ой', 'судьбой'], ['ать', 'искать']
    ];

    return textLines.map((line, index) => {
      // Для каждой второй строки пытаемся добавить рифму к предыдущей
      if (index % 2 === 1 && index > 0) {
        const prevLine = textLines[index - 1];
        // Ищем подходящую рифму
        for (const [end1, end2] of rhymePairs) {
          if (prevLine.endsWith(end1)) {
            // Если нашли подходящую рифму, модифицируем текущую строку
            const words = line.split(' ');
            if (words.length > 3) {
              words[words.length - 1] = words[words.length - 1].replace(/[,.!?]$/, '');
              return words.slice(0, -1).join(' ') + ' ' + end2;
            }
          }
        }
      }
      return line;
    });
  };

  // Разделяем текст на куплеты и припев
  const verse1 = enhanceRhymes(lines.slice(0, 4));
  const chorus = enhanceRhymes(lines.slice(4, 8));
  const verse2 = enhanceRhymes(lines.slice(8, 12));

  // Создаем третий куплет из оставшихся строк или генерируем новый
  let verse3;
  if (lines.length >= 16) {
    verse3 = enhanceRhymes(lines.slice(12, 16));
  } else {
    // Создаем уникальные строки для третьего куплета
    verse3 = [
      `${theme} освещает мой путь сквозь тьму`,
      `Я иду вперёд, несмотря на судьбу`,
      `Каждый день новый шаг к мечте`,
      `${genre} в моём сердце, в моей душе`
    ];
  }

  // Формируем структуру песни с улучшенной рифмой
  const formattedText = `
# ${genre.toUpperCase()} - ${theme}

## Куплет 1
${verse1.join('\n')}

## Припев
${chorus.join('\n')}

## Куплет 2
${verse2.join('\n')}

## Припев
${chorus.join('\n')}

## Куплет 3
${verse3.join('\n')}
  `

  return formattedText
}

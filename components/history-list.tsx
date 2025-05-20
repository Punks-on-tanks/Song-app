'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/lib/supabase-client'

type HistoryItem = {
  id: string
  genre: string
  mood: string
  theme: string
  text: string
  rating?: number
  created_at: string
}

interface HistoryListProps {
  onSelectItem: (item: HistoryItem) => void
}

export function HistoryList({ onSelectItem }: HistoryListProps) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const { supabase } = useSupabase()

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true)
        console.log('Fetching history...')

        // Проверяем, что supabase инициализирован
        if (!supabase) {
          console.warn('Supabase client not initialized')
          setLoading(false)

          // Используем моковые данные, если Supabase не инициализирован
          const mockData = [
            {
              id: '1',
              genre: 'rap',
              mood: 'happy',
              theme: 'Свобода',
              text: '# РЭП - Свобода\n\n## Куплет 1\nНовый день, новый шанс, мы на волне успеха\nПозитив в каждом слове, это не помеха\nСвобода всегда в моих мыслях\nЭто больше чем слова, это часть моей жизни\n\n## Припев\nСвобода - это то, что нас объединяет\nСвобода - в этом сила и наша правда\nСнова и снова мы возвращаемся к этому\nСвобода - это наш путь, наша история\n\n## Куплет 2\nДвижемся вперёд, не зная преград\nКаждый миг ценен, каждый успеху рад\nСвобода - это то, что даёт мне силы\nЧерез все испытания, через все мили',
              rating: 5,
              created_at: new Date().toISOString()
            },
            {
              id: '2',
              genre: 'pop',
              mood: 'sad',
              theme: 'Любовь',
              text: '# ПОП - Любовь\n\n## Куплет 1\nДождь за окном напоминает о тебе\nВоспоминания тают в серебряной воде\nЛюбовь всегда в моих мыслях\nЭто больше чем слова, это часть моей жизни\n\n## Припев\nЛюбовь - это то, что нас объединяет\nЛюбовь - в этом сила и наша правда\nСнова и снова мы возвращаемся к этому\nЛюбовь - это наш путь, наша история\n\n## Куплет 2\nМелодия грусти звучит в тишине\nЯ вспоминаю о нас, о тебе и о мне\nЛюбовь - это то, что даёт мне силы\nЧерез все испытания, через все мили',
              rating: 4,
              created_at: new Date(Date.now() - 86400000).toISOString()
            }
          ];
          setHistory(mockData);
          return;
        }

        // Пробуем получить данные из Supabase
        try {
          const { data, error } = await supabase
            .from('song_history')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50)

          if (error) {
            console.error('Supabase query error:', error)
            throw error
          }

          console.log('History data received:', data?.length || 0, 'items')
          setHistory(data || [])
        } catch (supabaseError) {
          console.error('Error with Supabase query:', supabaseError)

          // Используем моковые данные в случае ошибки
          const mockData = [
            {
              id: '1',
              genre: 'rap',
              mood: 'happy',
              theme: 'Свобода',
              text: '# РЭП - Свобода\n\n## Куплет 1\nНовый день, новый шанс, мы на волне успеха\nПозитив в каждом слове, это не помеха\nСвобода всегда в моих мыслях\nЭто больше чем слова, это часть моей жизни\n\n## Припев\nСвобода - это то, что нас объединяет\nСвобода - в этом сила и наша правда\nСнова и снова мы возвращаемся к этому\nСвобода - это наш путь, наша история\n\n## Куплет 2\nДвижемся вперёд, не зная преград\nКаждый миг ценен, каждый успеху рад\nСвобода - это то, что даёт мне силы\nЧерез все испытания, через все мили',
              rating: 5,
              created_at: new Date().toISOString()
            },
            {
              id: '2',
              genre: 'pop',
              mood: 'sad',
              theme: 'Любовь',
              text: '# ПОП - Любовь\n\n## Куплет 1\nДождь за окном напоминает о тебе\nВоспоминания тают в серебряной воде\nЛюбовь всегда в моих мыслях\nЭто больше чем слова, это часть моей жизни\n\n## Припев\nЛюбовь - это то, что нас объединяет\nЛюбовь - в этом сила и наша правда\nСнова и снова мы возвращаемся к этому\nЛюбовь - это наш путь, наша история\n\n## Куплет 2\nМелодия грусти звучит в тишине\nЯ вспоминаю о нас, о тебе и о мне\nЛюбовь - это то, что даёт мне силы\nЧерез все испытания, через все мили',
              rating: 4,
              created_at: new Date(Date.now() - 86400000).toISOString()
            }
          ];
          setHistory(mockData);
        }
      } catch (error) {
        console.error('Error in fetchHistory function:', error)
        // В случае ошибки устанавливаем пустой массив
        setHistory([])
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [supabase])

  const updateRating = async (id: string, rating: number) => {
    try {
      // Проверяем, что supabase инициализирован
      if (!supabase) {
        console.warn('Supabase client not initialized')
        return
      }

      const { error } = await supabase
        .from('song_history')
        .update({ rating })
        .eq('id', id)

      if (error) {
        console.error('Supabase update error:', error)
        throw error
      }

      // Обновляем локальное состояние
      setHistory(history.map(item =>
        item.id === id ? { ...item, rating } : item
      ))
    } catch (error) {
      console.error('Error updating rating:', error)
      // Показываем пользователю сообщение об ошибке (можно добавить компонент уведомления)
    }
  }

  if (loading) {
    return <div className="text-center py-4">Загрузка истории...</div>
  }

  if (history.length === 0) {
    return <div className="text-center py-4">История пуста</div>
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {history.map((item) => (
        <div
          key={item.id}
          className="p-4 border rounded-md hover:bg-accent/10 cursor-pointer"
          onClick={() => onSelectItem(item)}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">{item.theme}</h3>
            <div className="text-sm text-muted-foreground">
              {new Date(item.created_at).toLocaleDateString()}
            </div>
          </div>
          <div className="flex gap-2 text-sm text-muted-foreground mb-2">
            <span className="bg-primary/10 px-2 py-0.5 rounded">{item.genre}</span>
            <span className="bg-primary/10 px-2 py-0.5 rounded">{item.mood}</span>
          </div>
          <div className="flex items-center mt-2">
            <span className="mr-2 text-sm">Оценка:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateRating(item.id, star);
                  }}
                  className={`w-6 h-6 ${
                    (item.rating || 0) >= star
                      ? 'text-yellow-500'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

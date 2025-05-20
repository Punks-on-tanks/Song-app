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
        const { data, error } = await supabase
          .from('song_history')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) throw error
        setHistory(data || [])
      } catch (error) {
        console.error('Error fetching history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [supabase])

  const updateRating = async (id: string, rating: number) => {
    try {
      const { error } = await supabase
        .from('song_history')
        .update({ rating })
        .eq('id', id)

      if (error) throw error

      // Обновляем локальное состояние
      setHistory(history.map(item => 
        item.id === id ? { ...item, rating } : item
      ))
    } catch (error) {
      console.error('Error updating rating:', error)
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

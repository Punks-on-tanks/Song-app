'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSupabase } from '@/lib/supabase-client'
import { ThemeToggle } from '@/components/theme-toggle'
import { HistoryList } from '@/components/history-list'
import { EditableText } from '@/components/editable-text'

type HistoryItem = {
  id: string
  genre: string
  mood: string
  theme: string
  text: string
  rating?: number
  created_at: string
}

export default function SongGenerator() {
  const [genre, setGenre] = useState('pop')
  const [mood, setMood] = useState('happy')
  const [theme, setTheme] = useState('')
  const [generatedText, setGeneratedText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [editedText, setEditedText] = useState('')
  const { supabase } = useSupabase()

  const genres = [
    { value: 'rap', label: 'Рэп' },
    { value: 'pop', label: 'Поп' },
    { value: 'rock', label: 'Рок' }
  ]

  const moods = [
    { value: 'happy', label: 'Веселый' },
    { value: 'sad', label: 'Грустный' },
    { value: 'aggressive', label: 'Агрессивный' }
  ]

  const generateSong = async () => {
    // Проверяем наличие темы и жанра
    if (!theme.trim() || !genre) {
      console.error('Не выбран жанр или не указана тема');
      return;
    }

    setIsGenerating(true)
    console.log(`Generating song with genre: ${genre}, mood: ${mood}, theme: ${theme}`);

    try {
      // Вызов API для генерации текста
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ genre, mood, theme })
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setGeneratedText(data.text)
      setEditedText(data.text)

      // Сохранение в историю
      await supabase
        .from('song_history')
        .insert([{
          genre,
          mood,
          theme,
          text: data.text,
          created_at: new Date().toISOString()
        }])
    } catch (error) {
      console.error('Generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(editedText || generatedText)
  }

  const exportToTxt = () => {
    const textToExport = editedText || generatedText
    const blob = new Blob([textToExport], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `song_${theme.slice(0, 10)}.txt`
    a.click()
  }

  const handleHistoryItemSelect = (item: HistoryItem) => {
    setGenre(item.genre)
    setMood(item.mood)
    setTheme(item.theme)
    setGeneratedText(item.text)
    setEditedText(item.text)
    setShowHistory(false)
  }

  const handleSaveEdit = (text: string) => {
    setEditedText(text)
  }

  return (
    <div className="min-h-screen pb-8">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Генератор текстов песен</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? 'Скрыть историю' : 'История'}
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className={`md:col-span-${showHistory ? '2' : '3'} space-y-6`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Жанр</Label>
                <div className="relative">
                  <select
                    value={genre}
                    onChange={(e) => {
                      const value = e.target.value;
                      console.log(`Page setting genre to: ${value}`);
                      setGenre(value);
                    }}
                    className="block appearance-none w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="" disabled>Выберите жанр</option>
                    <option value="rap">Рэп</option>
                    <option value="pop">Поп</option>
                    <option value="rock">Рок</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              <div>
                <Label>Настроение</Label>
                <RadioGroup value={mood} onValueChange={setMood} className="flex gap-4">
                  {moods.map((m) => (
                    <div key={m.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={m.value} id={m.value} />
                      <Label htmlFor={m.value}>{m.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <div>
              <Label>Тема/идея</Label>
              <Textarea
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Введите основную тему для песни..."
                className="min-h-[100px]"
              />
            </div>

            <Button
              onClick={generateSong}
              disabled={isGenerating || !theme.trim() || !genre}
              className="w-full"
            >
              {isGenerating ? 'Генерация...' : 'Сгенерировать текст'}
            </Button>

            {generatedText && (
              <div className="space-y-4">
                <EditableText
                  text={generatedText}
                  onSave={handleSaveEdit}
                />

                <div className="flex gap-2">
                  <Button variant="outline" onClick={copyToClipboard}>
                    Копировать
                  </Button>
                  <Button variant="outline" onClick={exportToTxt}>
                    Экспорт в .txt
                  </Button>
                </div>
              </div>
            )}
          </div>

          {showHistory && (
            <div className="md:col-span-1 border-l pl-4">
              <h2 className="text-xl font-bold mb-4">История генераций</h2>
              <HistoryList onSelectItem={handleHistoryItemSelect} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

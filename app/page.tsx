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
  const [genre, setGenre] = useState('rap')
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
    if (!theme.trim()) return
    setIsGenerating(true)

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
                <Select value={genre} onValueChange={setGenre}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите жанр" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((g) => (
                      <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              disabled={isGenerating || !theme.trim()}
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

'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function LyricsGenerator() {
  const [genre, setGenre] = useState<string>('rap')
  const [mood, setMood] = useState<string>('sad')
  const [theme, setTheme] = useState<string>('')
  const [lyric, setLyric] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState<boolean>(false)

  const generateLyric = async () => {
    setIsGenerating(true)
    try {
      // Интеграция с DeepSeek API
      const prompt = `Сгенерируй ${mood} текст песни в жанре ${genre} на тему "${theme}". 
      Текст должен быть рифмованным и содержать припев и куплеты.`
      
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{role: "user", content: prompt}],
          temperature: 0.7,
          max_tokens: 1000
        })
      })

      const data = await response.json()
      setLyric(data.choices[0].message.content)
    } catch (error) {
      console.error('Generation error:', error)
      setLyric('Ошибка генерации. Попробуйте позже.')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(lyric)
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Генератор текстов песен</h1>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Жанр</label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите жанр" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rap">Рэп</SelectItem>
                <SelectItem value="pop">Поп</SelectItem>
                <SelectItem value="rock">Рок</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-2">Настроение</label>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите настроение" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sad">Грустное</SelectItem>
                <SelectItem value="happy">Веселое</SelectItem>
                <SelectItem value="aggressive">Агрессивное</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block mb-2">Основная идея текста</label>
        <Textarea
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Введите тему или ключевые слова"
        />
        </div>

        <Button 
          onClick={generateLyric}
          disabled={isGenerating || !theme}
          className="w-full"
        >
          {isGenerating ? 'Генерация...' : 'Сгенерировать текст'}
        </Button>

        {lyric && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-muted rounded-md whitespace-pre-line">
              {lyric}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={copyToClipboard}>
                Копировать текст
              </Button>
              <Button variant="outline">
                Сохранить в историю
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

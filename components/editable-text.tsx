'use client'

import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface EditableTextProps {
  text: string
  onSave: (text: string) => void
}

export function EditableText({ text, onSave }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(text)

  // Обновляем локальное состояние при изменении входящего текста
  useEffect(() => {
    setEditedText(text)
  }, [text])

  const handleSave = () => {
    onSave(editedText)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedText(text)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="space-y-2">
        <Textarea
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className="min-h-[200px] font-mono"
        />
        <div className="flex gap-2">
          <Button onClick={handleSave}>Сохранить</Button>
          <Button variant="outline" onClick={handleCancel}>Отмена</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <pre className="whitespace-pre-wrap p-4 border rounded bg-muted">{text}</pre>
      <Button variant="outline" onClick={() => setIsEditing(true)}>
        Редактировать
      </Button>
    </div>
  )
}

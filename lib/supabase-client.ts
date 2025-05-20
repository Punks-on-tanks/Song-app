import { createClient } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'

// Объявляем глобальный тип для TypeScript
declare global {
  var supabase: any
}

// Используем реальные значения из .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xvjwfdflndhditrxxicw.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2andmZGZsbmRoZGl0cnh4aWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMzczOTgsImV4cCI6MjA2MjgxMzM5OH0.ofpkRzg4khRYcI5tDblp8JTaku18PH_oH6xmNJX6h2A'

// Создаем клиент Supabase
let supabaseClient: any

// Инициализируем клиент с проверкой на стороне клиента
if (typeof window !== 'undefined') {
  // Мы на клиенте, безопасно создаем клиент
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
} else {
  // Мы на сервере, создаем клиент только если не был создан ранее
  if (!global.supabase) {
    global.supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  supabaseClient = global.supabase
}

export const supabase = supabaseClient

// Создаем контекст для Supabase
export const SupabaseContext = createContext({ supabase })

// Хук для использования Supabase в компонентах
export const useSupabase = () => useContext(SupabaseContext)

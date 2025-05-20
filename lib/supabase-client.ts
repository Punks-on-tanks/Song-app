import { createClient } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'

// Используем значения по умолчанию для предотвращения ошибок сборки
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Создаем клиент Supabase с проверкой на стороне клиента
let supabaseClient: any

// Инициализируем клиент только если мы на клиенте или если переменные окружения доступны
if (typeof window !== 'undefined' || (supabaseUrl !== 'https://placeholder-url.supabase.co' && supabaseAnonKey !== 'placeholder-key')) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = supabaseClient

// Создаем контекст для Supabase
export const SupabaseContext = createContext({ supabase })

// Хук для использования Supabase в компонентах
export const useSupabase = () => useContext(SupabaseContext)

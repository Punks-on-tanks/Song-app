import { createClient } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Создаем контекст для Supabase
export const SupabaseContext = createContext({ supabase })

// Хук для использования Supabase в компонентах
export const useSupabase = () => useContext(SupabaseContext)

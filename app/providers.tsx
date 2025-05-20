'use client'

import { ThemeProvider } from 'next-themes'
import { SupabaseContext, supabase } from '@/lib/supabase-client'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SupabaseContext.Provider value={{ supabase }}>
        {children}
      </SupabaseContext.Provider>
    </ThemeProvider>
  )
}

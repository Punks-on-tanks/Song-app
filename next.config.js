/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Добавляем настройки для улучшения совместимости с Vercel
  poweredByHeader: false,
  // Настройки для оптимизации изображений
  images: {
    domains: ['xvjwfdflndhditrxxicw.supabase.co'],
    formats: ['image/avif', 'image/webp'],
  },
  // Настройки для экспериментальных функций
  experimental: {
    // Отключаем serverActions, если они не используются
    serverActions: false,
  },
}

module.exports = nextConfig

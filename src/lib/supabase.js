import { createClient } from '@supabase/supabase-js'

// iOS PWA와 Safari는 localStorage를 공유하지 않지만 쿠키는 공유함.
// OAuth 리다이렉트 후 Safari에서 처리된 세션이 PWA에서도 유지되도록 쿠키 기반 스토리지 사용.
const cookieStorage = {
  getItem(key) {
    const match = document.cookie.match(new RegExp('(?:^|; )' + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]*)'))
    return match ? decodeURIComponent(match[1]) : null
  },
  setItem(key, value) {
    const secure = location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax${secure}`
  },
  removeItem(key) {
    document.cookie = `${key}=; path=/; max-age=0`
  },
}

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: cookieStorage,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
  }
)

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// iOS에서 Safari와 PWA는 localStorage를 공유하지 않지만 쿠키는 공유함.
// refresh_token(~50바이트)만 쿠키에 저장해 PWA 재시작 시 세션 복원에 사용.
const COOKIE = 'pebble_rt'
const isSecure = () => location.protocol === 'https:' ? '; Secure' : ''
const saveRT = (token) => {
  document.cookie = `${COOKIE}=${token}; path=/; max-age=31536000; SameSite=Lax${isSecure()}`
}
const loadRT = () => {
  const m = document.cookie.match(/(?:^|; )pebble_rt=([^;]+)/)
  return m ? m[1] : null
}
const clearRT = () => {
  document.cookie = `${COOKIE}=; path=/; max-age=0`
}

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      let { data: { session } } = await supabase.auth.getSession()

      // localStorage에 세션이 없으면 쿠키의 refresh_token으로 복원 시도 (iOS PWA)
      if (!session) {
        const rt = loadRT()
        if (rt) {
          const { data } = await supabase.auth.refreshSession({ refresh_token: rt })
          session = data.session
        }
      }

      setUser(session?.user ?? null)
      setLoading(false)
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session?.refresh_token) {
        saveRT(session.refresh_token)
      } else if (event === 'SIGNED_OUT') {
        clearRT()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })

  const signOut = async () => {
    clearRT()
    return supabase.auth.signOut()
  }

  return { user, loading, signInWithGoogle, signOut }
}

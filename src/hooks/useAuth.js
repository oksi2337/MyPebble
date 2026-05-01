import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// localStorage에 남아있는 기존 세션을 쿠키 스토리지로 한 번만 마이그레이션
function migrateLocalStorageSession() {
  try {
    const lsKeys = Object.keys(localStorage).filter(k => k.startsWith('sb-') && k.endsWith('-auth-token'))
    for (const key of lsKeys) {
      const val = localStorage.getItem(key)
      if (val && !document.cookie.includes(key)) {
        const secure = location.protocol === 'https:' ? '; Secure' : ''
        document.cookie = `${key}=${encodeURIComponent(val)}; path=/; max-age=31536000; SameSite=Lax${secure}`
      }
      localStorage.removeItem(key)
    }
  } catch {}
}

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    migrateLocalStorageSession()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })

  const signOut = () => supabase.auth.signOut()

  return { user, loading, signInWithGoogle, signOut }
}

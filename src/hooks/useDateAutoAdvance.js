import { useCallback } from 'react'

export function useDateAutoAdvance() {
  const onFocus = useCallback((e) => {
    e.currentTarget.dataset.yrCount = '0'
  }, [])

  const onKeyDown = useCallback((e) => {
    const el = e.currentTarget
    let n = +(el.dataset.yrCount || 0)

    if (/^\d$/.test(e.key)) {
      n++
      el.dataset.yrCount = String(n)
      if (n === 4) {
        el.dataset.yrCount = '0'
        setTimeout(() => {
          el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
        }, 0)
      }
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      el.dataset.yrCount = String(Math.max(0, n - 1))
    } else {
      el.dataset.yrCount = '0'
    }
  }, [])

  return { onFocus, onKeyDown }
}

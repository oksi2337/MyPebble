import { useState, useEffect, useRef } from 'react'
import styles from './DateInput.module.css'

function parse(value) {
  if (!value) return { y: '', m: '', d: '' }
  const [y = '', m = '', d = ''] = value.split('-')
  return { y, m, d }
}

export default function DateInput({ value, onChange, tabIndex = 0 }) {
  const monthRef = useRef(null)
  const dayRef = useRef(null)
  const [parts, setParts] = useState(() => parse(value))
  const { y, m, d } = parts
  const prevValue = useRef(value)

  useEffect(() => {
    if (value !== prevValue.current) {
      prevValue.current = value
      setParts(parse(value))
    }
  }, [value])

  const emit = (yr, mo, dy) => {
    if (yr.length === 4 && mo && dy) {
      onChange(`${yr}-${mo.padStart(2, '0')}-${dy.padStart(2, '0')}`)
    } else if (!yr && !mo && !dy) {
      onChange('')
    }
  }

  const onYear = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4)
    setParts(p => ({ ...p, y: val }))
    emit(val, m, d)
    if (val.length === 4) monthRef.current?.focus()
  }

  const onMonth = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 2)
    const val = raw.length === 2
      ? String(Math.min(12, Math.max(1, +raw))).padStart(2, '0')
      : raw
    setParts(p => ({ ...p, m: val }))
    emit(y, val, d)
    if (val.length === 2) dayRef.current?.focus()
  }

  const onDay = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 2)
    const val = raw.length === 2
      ? String(Math.min(31, Math.max(1, +raw))).padStart(2, '0')
      : raw
    setParts(p => ({ ...p, d: val }))
    emit(y, m, val)
  }

  return (
    <div className={styles.wrap}>
      <input
        type="text"
        inputMode="numeric"
        className={styles.year}
        value={y}
        onChange={onYear}
        placeholder="YYYY"
        maxLength={4}
        tabIndex={tabIndex}
      />
      <span className={styles.sep}>-</span>
      <input
        ref={monthRef}
        type="text"
        inputMode="numeric"
        className={styles.part}
        value={m}
        onChange={onMonth}
        onKeyDown={e => { if (e.key === 'Backspace' && !m) e.currentTarget.parentElement.querySelector('input').focus() }}
        placeholder="MM"
        maxLength={2}
        tabIndex={tabIndex}
      />
      <span className={styles.sep}>-</span>
      <input
        ref={dayRef}
        type="text"
        inputMode="numeric"
        className={styles.part}
        value={d}
        onChange={onDay}
        onKeyDown={e => { if (e.key === 'Backspace' && !d) monthRef.current?.focus() }}
        placeholder="DD"
        maxLength={2}
        tabIndex={tabIndex}
      />
    </div>
  )
}

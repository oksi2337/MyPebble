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

  // 연/월/일 모두 완성됐을 때만 emit — 부분 값으로 부모 상태를 덮어쓰지 않음
  const emit = (yr, mo, dy) => {
    if (yr.length === 4 && mo.length === 2 && dy.length === 2) {
      onChange(`${yr}-${mo}-${dy}`)
    } else if (!yr && !mo && !dy) {
      onChange('')
    }
  }

  const onYear = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4)
    setParts(p => ({ ...p, y: val }))
    if (val.length === 4) monthRef.current?.focus()
  }

  const onMonth = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 2)
    if (raw.length === 2) {
      const val = String(Math.min(12, Math.max(1, +raw || 1))).padStart(2, '0')
      setParts(p => ({ ...p, m: val }))
      emit(y, val, d)
      dayRef.current?.focus()
    } else {
      setParts(p => ({ ...p, m: raw }))
    }
  }

  const onMonthBlur = () => {
    if (m.length === 1) {
      const val = m.padStart(2, '0')
      setParts(p => ({ ...p, m: val }))
      emit(y, val, d)
    }
  }

  const onDay = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 2)
    if (raw.length === 2) {
      const val = String(Math.min(31, Math.max(1, +raw || 1))).padStart(2, '0')
      setParts(p => ({ ...p, d: val }))
      emit(y, m, val)
    } else {
      setParts(p => ({ ...p, d: raw }))
    }
  }

  const onDayBlur = () => {
    if (d.length === 1) {
      const val = d.padStart(2, '0')
      setParts(p => ({ ...p, d: val }))
      emit(y, m, val)
    }
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
        onBlur={onMonthBlur}
        onKeyDown={e => { if (e.key === 'Backspace' && !m) e.currentTarget.closest('[class]').querySelector('input').focus() }}
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
        onBlur={onDayBlur}
        onKeyDown={e => { if (e.key === 'Backspace' && !d) monthRef.current?.focus() }}
        placeholder="DD"
        maxLength={2}
        tabIndex={tabIndex}
      />
    </div>
  )
}

import { useState, useRef, useCallback } from 'react'
import styles from './AddTodoBar.module.css'

export default function AddTodoBar({ onAdd }) {
  const [text, setText] = useState('')
  const [showDates, setShowDates] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [deadline, setDeadline] = useState('')
  const [dateError, setDateError] = useState('')
  const inputRef = useRef(null)

  const canSubmit = text.trim().length > 0

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return
    if (startDate && deadline && startDate > deadline) {
      setDateError('시작일이 마감일보다 늦습니다')
      return
    }
    onAdd(text.trim(), startDate || null, deadline || null)
    setText('')
    setStartDate('')
    setDeadline('')
    setShowDates(false)
    setDateError('')
    inputRef.current?.focus()
  }, [canSubmit, text, startDate, deadline, onAdd])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') handleSubmit()
  }, [handleSubmit])

  const toggleDates = useCallback(() => {
    setShowDates(v => !v)
    setDateError('')
  }, [])

  const hasDates = startDate || deadline

  return (
    <div className={styles.bar}>
      <div className={`${styles.dateRow} ${showDates ? styles.dateRowOpen : ''}`}>
        <div className={styles.dateFields}>
          <span className={styles.dateLabel}>시작</span>
          <input
            type="date"
            className={styles.dateInput}
            value={startDate}
            onChange={e => { setStartDate(e.target.value); setDateError('') }}
            tabIndex={showDates ? 0 : -1}
          />
          <span className={styles.dateSep}>~</span>
          <span className={styles.dateLabel}>마감</span>
          <input
            type="date"
            className={styles.dateInput}
            value={deadline}
            onChange={e => { setDeadline(e.target.value); setDateError('') }}
            tabIndex={showDates ? 0 : -1}
          />
        </div>
        {dateError && <p className={styles.dateError}>{dateError}</p>}
      </div>

      <div className={styles.inputRow}>
        <button
          className={`${styles.dateToggle} ${showDates ? styles.dateToggleActive : ''}`}
          onClick={toggleDates}
          aria-label="날짜 설정 토글"
          aria-expanded={showDates}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="2.5" width="14" height="12.5" rx="2" stroke="currentColor" strokeWidth="1.4" />
            <path d="M1 6.5H15" stroke="currentColor" strokeWidth="1.4" />
            <path d="M4.5 1V4M11.5 1V4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          {hasDates && <span className={styles.dateDot} />}
        </button>

        <input
          ref={inputRef}
          className={styles.textInput}
          type="text"
          placeholder="새 할 일 추가..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={200}
        />

        <button
          className={`${styles.submitBtn} ${canSubmit ? styles.submitActive : ''}`}
          onClick={handleSubmit}
          disabled={!canSubmit}
          aria-label="추가"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path
              d="M7.5 13.5V1.5M1.5 7.5L7.5 1.5L13.5 7.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

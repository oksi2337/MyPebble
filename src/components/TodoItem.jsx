import { useState, useRef, useCallback, useMemo } from 'react'
import DdayBadge from './DdayBadge'
import { formatDate } from '../utils/sortTodos'
import styles from './TodoItem.module.css'

export default function TodoItem({ todo, onToggle, onDelete, onOpenDetail, isNew }) {
  const [completing, setCompleting] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const longPressTimer = useRef(null)

  const handleToggle = useCallback(() => {
    if (todo.completed) { onToggle(todo.id); return }
    setCompleting(true)
    setTimeout(() => { setCompleting(false); onToggle(todo.id) }, 380)
  }, [todo.completed, todo.id, onToggle])

  const handleTouchStart = useCallback(() => {
    longPressTimer.current = setTimeout(() => setShowDelete(true), 600)
  }, [])

  const handleTouchEnd = useCallback(() => clearTimeout(longPressTimer.current), [])

  const dateDisplay = useMemo(() => {
    const s = todo.startDate ? formatDate(todo.startDate) : ''
    const e = todo.deadline ? formatDate(todo.deadline) : ''
    if (s && e) return `${s} ~ ${e}`
    if (s) return `${s} ~`
    if (e) return `~ ${e}`
    return ''
  }, [todo.startDate, todo.deadline])

  const cardClass = [
    styles.card,
    todo.completed ? styles.completed : '',
    completing ? styles.completing : '',
    isNew ? styles.slideIn : '',
  ].filter(Boolean).join(' ')

  return (
    <div
      className={cardClass}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <button
        className={`${styles.checkbox} ${(todo.completed || completing) ? styles.checked : ''}`}
        onClick={handleToggle}
        role="checkbox"
        aria-checked={todo.completed}
        aria-label={todo.completed ? '완료 취소' : '완료로 표시'}
      >
        <svg className={styles.checkIcon} width="11" height="9" viewBox="0 0 11 9" fill="none">
          <path d="M1 4L4 7.5L10 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className={styles.content} onClick={() => onOpenDetail(todo.id)}>
        <p className={`${styles.text} ${todo.completed ? styles.strikethrough : ''}`}>
          {todo.text}
        </p>

        <div className={styles.meta}>
          {dateDisplay && (
            <span className={styles.dateArea}>
              {dateDisplay}
              {todo.deadline && !todo.completed && <DdayBadge deadline={todo.deadline} />}
            </span>
          )}
          {todo.memo && (
            <span className={styles.memoIndicator}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <rect x="1" y="1" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M3 4h5M3 6h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
              </svg>
              메모
            </span>
          )}
        </div>
      </div>

      <button
        className={`${styles.deleteBtn} ${showDelete ? styles.deleteVisible : ''}`}
        onClick={() => onDelete(todo.id)}
        aria-label="삭제"
        tabIndex={showDelete ? 0 : -1}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  )
}

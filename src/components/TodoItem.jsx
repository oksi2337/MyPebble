import { useState, useRef, useCallback, useMemo } from 'react'
import DdayBadge from './DdayBadge'
import styles from './TodoItem.module.css'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const [, m, d] = dateStr.split('-').map(Number)
  return `${m}/${d}`
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit, isNew }) {
  const [completing, setCompleting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const [editingDates, setEditingDates] = useState(false)
  const [editStart, setEditStart] = useState(todo.startDate || '')
  const [editDeadline, setEditDeadline] = useState(todo.deadline || '')
  const [dateError, setDateError] = useState('')
  const [showDelete, setShowDelete] = useState(false)
  const inputRef = useRef(null)
  const longPressTimer = useRef(null)

  const handleToggle = useCallback(() => {
    if (todo.completed) {
      onToggle(todo.id)
      return
    }
    setCompleting(true)
    setTimeout(() => {
      setCompleting(false)
      onToggle(todo.id)
    }, 380)
  }, [todo.completed, todo.id, onToggle])

  const startEdit = useCallback(() => {
    if (todo.completed) return
    setEditing(true)
    setEditText(todo.text)
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [todo.completed, todo.text])

  const commitEdit = useCallback(() => {
    const trimmed = editText.trim()
    if (trimmed && trimmed !== todo.text) {
      onEdit(todo.id, { text: trimmed })
    } else if (!trimmed) {
      setEditText(todo.text)
    }
    setEditing(false)
  }, [editText, todo.text, todo.id, onEdit])

  const handleEditKeyDown = useCallback((e) => {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') { setEditText(todo.text); setEditing(false) }
  }, [commitEdit, todo.text])

  const openDateEdit = useCallback(() => {
    if (todo.completed) return
    setEditStart(todo.startDate || '')
    setEditDeadline(todo.deadline || '')
    setDateError('')
    setEditingDates(true)
  }, [todo.completed, todo.startDate, todo.deadline])

  const commitDates = useCallback(() => {
    if (editStart && editDeadline && editStart > editDeadline) {
      setDateError('시작일이 마감일보다 늦습니다')
      return
    }
    onEdit(todo.id, { startDate: editStart || null, deadline: editDeadline || null })
    setEditingDates(false)
    setDateError('')
  }, [editStart, editDeadline, todo.id, onEdit])

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
        <svg
          className={styles.checkIcon}
          width="11" height="9"
          viewBox="0 0 11 9"
          fill="none"
        >
          <path
            d="M1 4L4 7.5L10 1"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className={styles.content}>
        {editing ? (
          <input
            ref={inputRef}
            className={styles.editInput}
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleEditKeyDown}
            maxLength={200}
          />
        ) : (
          <p
            className={`${styles.text} ${todo.completed ? styles.strikethrough : ''}`}
            onClick={startEdit}
            title={todo.text}
          >
            {todo.text}
          </p>
        )}

        <div className={styles.meta}>
          {!editingDates && (
            <button
              className={`${styles.dateArea} ${!dateDisplay && !todo.completed ? styles.noDate : ''}`}
              onClick={openDateEdit}
            >
              {dateDisplay || (!todo.completed ? '날짜 추가' : '')}
              {todo.deadline && !todo.completed && (
                <DdayBadge deadline={todo.deadline} />
              )}
            </button>
          )}

          {editingDates && (
            <div className={styles.dateEditor}>
              <input
                type="date"
                className={styles.dateInput}
                value={editStart}
                onChange={e => { setEditStart(e.target.value); setDateError('') }}
              />
              <span className={styles.dateSep}>~</span>
              <input
                type="date"
                className={styles.dateInput}
                value={editDeadline}
                onChange={e => { setEditDeadline(e.target.value); setDateError('') }}
              />
              <button className={styles.dateConfirmBtn} onClick={commitDates}>확인</button>
              <button
                className={styles.dateCancelBtn}
                onClick={() => { setEditingDates(false); setDateError('') }}
              >
                취소
              </button>
              {dateError && <p className={styles.dateError}>{dateError}</p>}
            </div>
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
          <path
            d="M1 1L11 11M11 1L1 11"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}

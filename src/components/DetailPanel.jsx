import { useState, useEffect } from 'react'
import styles from './DetailPanel.module.css'

export default function DetailPanel({ todo, onClose, onEdit }) {
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState(todo.text)
  const [memo, setMemo] = useState(todo.memo || '')
  const [startDate, setStartDate] = useState(todo.startDate || '')
  const [deadline, setDeadline] = useState(todo.deadline || '')
  const [dateError, setDateError] = useState('')

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  const save = () => {
    const trimmed = title.trim()
    if (startDate && deadline && startDate > deadline) {
      setDateError('시작일이 마감일보다 늦습니다')
      return false
    }
    const updates = {}
    if (trimmed && trimmed !== todo.text) updates.text = trimmed
    if (memo !== (todo.memo || '')) updates.memo = memo || null
    if (startDate !== (todo.startDate || '')) updates.startDate = startDate || null
    if (deadline !== (todo.deadline || '')) updates.deadline = deadline || null
    if (Object.keys(updates).length > 0) onEdit(todo.id, updates)
    return true
  }

  const handleClose = () => {
    if (!save()) return
    setVisible(false)
    setTimeout(onClose, 280)
  }

  const handleOverlayClick = () => handleClose()

  return (
    <div
      className={`${styles.overlay} ${visible ? styles.overlayVisible : ''}`}
      onClick={handleOverlayClick}
    >
      <div
        className={`${styles.panel} ${visible ? styles.panelVisible : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.handle} />

        <div className={styles.header}>
          <button className={styles.backBtn} onClick={handleClose}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            닫기
          </button>
        </div>

        <div className={styles.body}>
          <textarea
            className={styles.titleInput}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="할 일"
            maxLength={200}
          />

          <div className={styles.section}>
            <p className={styles.sectionLabel}>날짜</p>
            <div className={styles.dateRows}>
              <div className={styles.dateRow}>
                <span className={styles.dateLabel}>시작일</span>
                <input
                  type="date"
                  className={styles.dateInput}
                  value={startDate}
                  onChange={e => { setStartDate(e.target.value); setDateError('') }}
                />
              </div>
              <div className={styles.dateRow}>
                <span className={styles.dateLabel}>마감일</span>
                <input
                  type="date"
                  className={styles.dateInput}
                  value={deadline}
                  onChange={e => { setDeadline(e.target.value); setDateError('') }}
                />
              </div>
              {dateError && <p className={styles.dateError}>{dateError}</p>}
            </div>
          </div>

          <div className={styles.section}>
            <p className={styles.sectionLabel}>메모</p>
            <textarea
              className={styles.memoInput}
              value={memo}
              onChange={e => setMemo(e.target.value)}
              placeholder="세부 내용을 입력하세요..."
              maxLength={2000}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import DateInput from './DateInput'
import styles from './DetailPanel.module.css'

const TABS = [
  { key: 'done', label: '완료' },
  { key: 'doing', label: '진행중' },
  { key: 'todo', label: '필요' },
]

const MEMO_DEFAULT = {
  left:  { done: '', doing: '', todo: '' },
  right: { done: '', doing: '', todo: '' },
}

function parseMemo(raw) {
  if (!raw) return MEMO_DEFAULT
  try {
    const parsed = JSON.parse(raw)
    if (parsed?.left && parsed?.right) return parsed
  } catch {}
  return { ...MEMO_DEFAULT, left: { ...MEMO_DEFAULT.left, todo: raw } }
}

function serializeMemo(data) {
  const hasContent = Object.values(data).some(side =>
    Object.values(side).some(v => v.trim())
  )
  return hasContent ? JSON.stringify(data) : null
}

export default function DetailPanel({ todo, onClose, onEdit }) {
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState(todo.text)
  const [memoData, setMemoData] = useState(() => parseMemo(todo.memo))
  const [leftTab, setLeftTab] = useState('todo')
  const [rightTab, setRightTab] = useState('doing')
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
    const newMemo = serializeMemo(memoData)
    if (newMemo !== (todo.memo || null)) updates.memo = newMemo
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

  const handleMemoChange = (side, val) => {
    const tab = side === 'left' ? leftTab : rightTab
    setMemoData(prev => ({ ...prev, [side]: { ...prev[side], [tab]: val } }))
  }

  return (
    <div
      className={`${styles.overlay} ${visible ? styles.overlayVisible : ''}`}
      onClick={handleClose}
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
                <DateInput
                  value={startDate}
                  onChange={v => { setStartDate(v); setDateError('') }}
                />
              </div>
              <div className={styles.dateRow}>
                <span className={styles.dateLabel}>마감일</span>
                <DateInput
                  value={deadline}
                  onChange={v => { setDeadline(v); setDateError('') }}
                />
              </div>
              {dateError && <p className={styles.dateError}>{dateError}</p>}
            </div>
          </div>

          <div className={styles.section}>
            <p className={styles.sectionLabel}>메모</p>
            <div className={styles.memoColumns}>
              {(['left', 'right']).map(side => {
                const activeTab = side === 'left' ? leftTab : rightTab
                const setActiveTab = side === 'left' ? setLeftTab : setRightTab
                return (
                  <div key={side} className={styles.memoColumn}>
                    <div className={styles.memoTabs}>
                      {TABS.map(t => (
                        <button
                          key={t.key}
                          className={`${styles.memoTab} ${activeTab === t.key ? styles.memoTabActive : ''}`}
                          onClick={() => setActiveTab(t.key)}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                    <textarea
                      className={styles.memoInput}
                      value={memoData[side][activeTab]}
                      onChange={e => handleMemoChange(side, e.target.value)}
                      placeholder="내용 입력..."
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import styles from './NotePanel.module.css'

const LOCAL_KEY = 'pebble_user_note'

const PLACEHOLDERS = ['휘발되기 전에', '잊기 전에 잡기', '뇌 임시저장']
const randomPlaceholder = () => PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]

const saveToSupabase = (userId, content) =>
  supabase.from('user_notes').upsert({
    user_id: userId,
    content,
    updated_at: new Date().toISOString(),
  })

export default function NotePanel({ userId, onClose }) {
  const [visible, setVisible] = useState(false)
  const [content, setContent] = useState(() => localStorage.getItem(LOCAL_KEY) ?? '')
  const [placeholder] = useState(randomPlaceholder)
  const saveTimer = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    supabase
      .from('user_notes')
      .select('content')
      .eq('user_id', userId)
      .single()
      .then(({ data }) => {
        if (data?.content != null) {
          setContent(data.content)
          localStorage.setItem(LOCAL_KEY, data.content)
        }
      })
    requestAnimationFrame(() => {
      setVisible(true)
      setTimeout(() => textareaRef.current?.focus(), 300)
    })
  }, [userId])

  const handleChange = (val) => {
    setContent(val)
    localStorage.setItem(LOCAL_KEY, val)
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => saveToSupabase(userId, val), 800)
  }

  const handleClose = () => {
    clearTimeout(saveTimer.current)
    localStorage.setItem(LOCAL_KEY, content)
    saveToSupabase(userId, content)
    setVisible(false)
    setTimeout(onClose, 280)
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
          <span className={styles.title}>메모</span>
        </div>

        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={content}
          onChange={e => handleChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}

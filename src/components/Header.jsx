import styles from './Header.module.css'

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

export default function Header({ user, onSignOut, onNoteOpen, darkMode, onToggleDark }) {
  const today = new Date()
  const month = today.getMonth() + 1
  const date = today.getDate()
  const day = DAYS[today.getDay()]

  const avatar = user?.user_metadata?.avatar_url
  const name = user?.user_metadata?.name

  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>
        <svg className={styles.pebble} viewBox="0 0 36 30" fill="none" aria-hidden="true">
          <path d="M6 22C2 18 1 12 4 7C7 3 13 1 20 2C27 3 34 7 35 14C36 20 31 27 24 29C17 31 10 26 6 22Z" fill="#c9bfb3"/>
          <path d="M10 7C8 9 8 13 11 14C13 15 15 12 14 9C13 7 11 6 10 7Z" fill="#e0d8d0" opacity="0.85"/>
          <path d="M20 23C18 24 15 23 14 22" stroke="#b5a99b" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
        </svg>
        Pebble
      </h1>
      <p className={styles.date}>{month}월 {date}일 {day}요일</p>

      <button
        className={`${styles.themeBtn} ${darkMode ? styles.isDark : ''}`}
        onClick={onToggleDark}
        aria-label={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
      >
        {darkMode ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M9 1.5V3M9 15v1.5M1.5 9H3M15 9h1.5M3.7 3.7l1.05 1.05M13.25 13.25l1.05 1.05M3.7 14.3l1.05-1.05M13.25 4.75l1.05-1.05" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M15.5 10.8A6.5 6.5 0 0 1 7.2 2.5a6.5 6.5 0 1 0 8.3 8.3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <button className={styles.noteBtn} onClick={onNoteOpen} aria-label="메모 열기">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="2" width="11" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M14 5.5L17 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M14 8.5L17 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M14 11.5L17 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M6 7H10M6 10H10M6 13H8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      </button>

      <button className={styles.avatarBtn} onClick={onSignOut} title={`${name} · 로그아웃`}>
        {avatar
          ? <img className={styles.avatar} src={avatar} alt={name} referrerPolicy="no-referrer" />
          : <span className={styles.avatarFallback}>{name?.[0] ?? '?'}</span>
        }
      </button>
    </header>
  )
}

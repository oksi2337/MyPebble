import styles from './Header.module.css'

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

export default function Header({ user, onSignOut }) {
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
      <button className={styles.avatarBtn} onClick={onSignOut} title={`${name} · 로그아웃`}>
        {avatar
          ? <img className={styles.avatar} src={avatar} alt={name} referrerPolicy="no-referrer" />
          : <span className={styles.avatarFallback}>{name?.[0] ?? '?'}</span>
        }
      </button>
    </header>
  )
}

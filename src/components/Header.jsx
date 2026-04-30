import styles from './Header.module.css'

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

export default function Header() {
  const today = new Date()
  const month = today.getMonth() + 1
  const date = today.getDate()
  const day = DAYS[today.getDay()]

  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>Pebble</h1>
      <p className={styles.date}>{month}월 {date}일 {day}요일</p>
    </header>
  )
}

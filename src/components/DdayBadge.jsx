import { calcDday } from '../utils/sortTodos'
import styles from './DdayBadge.module.css'

export default function DdayBadge({ deadline }) {
  const days = calcDday(deadline)
  if (days === null) return null

  let label, variant

  if (days === 0) {
    label = 'D-day'
    variant = 'today'
  } else if (days < 0) {
    label = `D+${Math.abs(days)}`
    variant = 'overdue'
  } else if (days <= 3) {
    label = `D-${days}`
    variant = 'urgent'
  } else {
    label = `D-${days}`
    variant = 'normal'
  }

  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {label}
    </span>
  )
}

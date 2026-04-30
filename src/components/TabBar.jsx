import styles from './TabBar.module.css'

const TABS = [
  { id: 'personal', label: '개인' },
  { id: 'work', label: '업무' },
]

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <div className={styles.tabBar} role="tablist">
      {TABS.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

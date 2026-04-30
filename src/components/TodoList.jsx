import { useMemo } from 'react'
import { sortTodos } from '../utils/sortTodos'
import TodoItem from './TodoItem'
import styles from './TodoList.module.css'

export default function TodoList({ todos, onToggle, onDelete, onEdit, recentlyAddedId }) {
  const sorted = useMemo(() => sortTodos(todos), [todos])
  const incomplete = sorted.filter(t => !t.completed)
  const completed = sorted.filter(t => t.completed)

  if (todos.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
            <path d="M14 20H26M20 14V26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <p className={styles.emptyText}>할 일이 없어요</p>
        <p className={styles.emptySubtext}>아래에서 새 할 일을 추가해보세요</p>
      </div>
    )
  }

  return (
    <div className={styles.list}>
      {incomplete.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          isNew={todo.id === recentlyAddedId}
        />
      ))}

      {completed.length > 0 && (
        <>
          {incomplete.length > 0 && <div className={styles.divider} />}
          <p className={styles.completedLabel}>완료 {completed.length}</p>
          {completed.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
              isNew={false}
            />
          ))}
        </>
      )}
    </div>
  )
}

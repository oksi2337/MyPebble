export function formatDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-').map(Number)
  const currentYear = new Date().getFullYear()
  if (y !== currentYear) return `${y}/${m}/${d}`
  return `${m}/${d}`
}

export function sortTodos(todos) {
  const incomplete = todos.filter(t => !t.completed)
  const completed = todos.filter(t => t.completed)

  const withDeadline = incomplete
    .filter(t => t.deadline)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))

  const withStartOnly = incomplete
    .filter(t => !t.deadline && t.startDate)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))

  const noDates = incomplete
    .filter(t => !t.deadline && !t.startDate)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))

  const sortedCompleted = [...completed].sort((a, b) =>
    (b.completedAt || '').localeCompare(a.completedAt || '')
  )

  return [...withDeadline, ...withStartOnly, ...noDates, ...sortedCompleted]
}

export function calcDday(deadline) {
  if (!deadline) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [y, m, d] = deadline.split('-').map(Number)
  const due = new Date(y, m - 1, d)
  return Math.ceil((due - today) / (1000 * 60 * 60 * 24))
}

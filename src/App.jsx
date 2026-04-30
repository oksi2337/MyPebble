import { useState, useCallback, useEffect, useMemo } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useAuth } from './hooks/useAuth'
import { supabase } from './lib/supabase'
import { getThisWeekTodos } from './utils/sortTodos'
import Header from './components/Header'
import TabBar from './components/TabBar'
import TodoList from './components/TodoList'
import AddTodoBar from './components/AddTodoBar'
import LoginScreen from './components/LoginScreen'
import DetailPanel from './components/DetailPanel'
import NotePanel from './components/NotePanel'

const fromDb = (row) => ({
  id: row.id,
  text: row.text,
  startDate: row.start_date,
  deadline: row.deadline,
  completed: row.completed,
  createdAt: row.created_at,
  completedAt: row.completed_at,
  memo: row.memo || null,
})

const toDb = (todo, userId, tab) => ({
  id: todo.id,
  user_id: userId,
  text: todo.text,
  start_date: todo.startDate,
  deadline: todo.deadline,
  completed: todo.completed,
  created_at: todo.createdAt,
  completed_at: todo.completedAt,
  memo: todo.memo || null,
  tab,
})

function App() {
  const { user, loading, signInWithGoogle, signOut } = useAuth()
  const [activeTab, setActiveTab] = useLocalStorage('pebble_active_tab', 'personal')
  const [darkMode, setDarkMode] = useLocalStorage('pebble_dark_mode', false)
  const [personalTodos, setPersonalTodos] = useState([])
  const [workTodos, setWorkTodos] = useState([])
  const [recentlyAddedId, setRecentlyAddedId] = useState(null)
  const [selectedTodoId, setSelectedTodoId] = useState(null)
  const [noteOpen, setNoteOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const isWeekView = activeTab === 'week'
  const todos = isWeekView
    ? getThisWeekTodos([...personalTodos, ...workTodos])
    : activeTab === 'personal' ? personalTodos : workTodos
  const setTodos = activeTab === 'personal' ? setPersonalTodos : setWorkTodos

  const selectedTodo = selectedTodoId
    ? [...personalTodos, ...workTodos].find(t => t.id === selectedTodoId)
    : null

  useEffect(() => {
    if (!user) { setPersonalTodos([]); setWorkTodos([]); return }
    supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (!data) return
        setPersonalTodos(data.filter(r => r.tab === 'personal').map(fromDb))
        setWorkTodos(data.filter(r => r.tab === 'work').map(fromDb))
      })
  }, [user])

  // 탭 전환 시 패널 닫기
  useEffect(() => { setSelectedTodoId(null) }, [activeTab])

  const addTodo = useCallback((text, startDate, deadline) => {
    const newTodo = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text,
      startDate: startDate || null,
      deadline: deadline || null,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      memo: null,
    }
    setTodos(prev => [...prev, newTodo])
    setRecentlyAddedId(newTodo.id)
    setTimeout(() => setRecentlyAddedId(null), 700)
    supabase.from('todos').insert(toDb(newTodo, user.id, activeTab))
  }, [setTodos, user, activeTab])

  const toggleTodo = useCallback((id) => {
    const todo = [...personalTodos, ...workTodos].find(t => t.id === id)
    if (!todo) return
    const completed = !todo.completed
    const completedAt = completed ? new Date().toISOString() : null
    const updater = prev => prev.map(t =>
      t.id === id ? { ...t, completed, completedAt } : t
    )
    setPersonalTodos(updater)
    setWorkTodos(updater)
    supabase.from('todos').update({ completed, completed_at: completedAt }).eq('id', id)
  }, [personalTodos, workTodos])

  const deleteTodo = useCallback((id) => {
    setSelectedTodoId(prev => prev === id ? null : prev)
    setPersonalTodos(prev => prev.filter(t => t.id !== id))
    setWorkTodos(prev => prev.filter(t => t.id !== id))
    supabase.from('todos').delete().eq('id', id)
  }, [])

  const editTodo = useCallback((id, updates) => {
    const updateBoth = (setter) =>
      setter(prev => prev.map(todo => todo.id === id ? { ...todo, ...updates } : todo))
    updateBoth(setPersonalTodos)
    updateBoth(setWorkTodos)

    const dbUpdates = {}
    if ('text' in updates) dbUpdates.text = updates.text
    if ('startDate' in updates) dbUpdates.start_date = updates.startDate
    if ('deadline' in updates) dbUpdates.deadline = updates.deadline
    if ('memo' in updates) dbUpdates.memo = updates.memo
    supabase.from('todos').update(dbUpdates).eq('id', id)
  }, [])

  if (loading) return null
  if (!user) return <LoginScreen onGoogleLogin={signInWithGoogle} />

  return (
    <div className="app-shell">
      <div className="app-container" data-tab={activeTab}>
        <Header user={user} onSignOut={signOut} onNoteOpen={() => setNoteOpen(true)} darkMode={darkMode} onToggleDark={() => setDarkMode(v => !v)} />
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        <TodoList
          key={activeTab}
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onOpenDetail={setSelectedTodoId}
          recentlyAddedId={recentlyAddedId}
          isWeekView={isWeekView}
        />
        {!isWeekView && <AddTodoBar onAdd={addTodo} />}
      </div>

      {selectedTodo && (
        <DetailPanel
          todo={selectedTodo}
          onClose={() => setSelectedTodoId(null)}
          onEdit={editTodo}
        />
      )}

      {noteOpen && (
        <NotePanel
          userId={user.id}
          onClose={() => setNoteOpen(false)}
        />
      )}
    </div>
  )
}

export default App

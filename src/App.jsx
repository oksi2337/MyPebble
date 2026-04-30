import { useState, useCallback } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import Header from './components/Header'
import TabBar from './components/TabBar'
import TodoList from './components/TodoList'
import AddTodoBar from './components/AddTodoBar'

function App() {
  const [activeTab, setActiveTab] = useLocalStorage('pebble_active_tab', 'personal')
  const [personalTodos, setPersonalTodos] = useLocalStorage('pebble_personal', [])
  const [workTodos, setWorkTodos] = useLocalStorage('pebble_work', [])
  const [recentlyAddedId, setRecentlyAddedId] = useState(null)

  const todos = activeTab === 'personal' ? personalTodos : workTodos
  const setTodos = activeTab === 'personal' ? setPersonalTodos : setWorkTodos

  const addTodo = useCallback((text, startDate, deadline) => {
    const newTodo = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text,
      startDate: startDate || null,
      deadline: deadline || null,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    }
    setTodos(prev => [...prev, newTodo])
    setRecentlyAddedId(newTodo.id)
    setTimeout(() => setRecentlyAddedId(null), 700)
  }, [setTodos])

  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id
        ? {
            ...todo,
            completed: !todo.completed,
            completedAt: !todo.completed ? new Date().toISOString() : null,
          }
        : todo
    ))
  }, [setTodos])

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }, [setTodos])

  const editTodo = useCallback((id, updates) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, ...updates } : todo
    ))
  }, [setTodos])

  return (
    <div className="app-shell">
      <div className="app-container" data-tab={activeTab}>
        <Header />
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        <TodoList
          key={activeTab}
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
          recentlyAddedId={recentlyAddedId}
        />
        <AddTodoBar onAdd={addTodo} />
      </div>
    </div>
  )
}

export default App

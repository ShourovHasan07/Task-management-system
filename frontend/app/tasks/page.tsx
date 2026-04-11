'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from '../components/Sidebar'
import TaskTable from '../components/TaskTable'
import TaskModal from '../components/TaskModal'
import { Plus } from 'lucide-react'

interface Task {
  id: number
  title: string
  assignee: string
  status: string
  description: string
}

export default function TasksPage() {
  const { isAuthenticated, loading: authLoading, clearAuth } = useAuth()
  const router = useRouter()

  const [tasks, setTasks] = useState<Task[]>([])
  const [loadingTasks, setLoadingTasks] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const getAuthToken = () => localStorage.getItem('token')

  const apiRequest = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken()
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    }

    const res = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    })

    if (res.status === 401) {
      clearAuth()   // no backend call – just clear state and redirect
      throw new Error('SESSION_EXPIRED')
    }
    return res
  }

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true)
      setError(null)
      const res = await apiRequest('http://localhost:3001/tasks')
      const data = await res.json()
      setTasks(Array.isArray(data) ? data : data.tasks || [])
    } catch (err: any) {
      if (err.message === 'SESSION_EXPIRED') return
      console.error('Fetch tasks error:', err)
      setError('Unable to load tasks. Please try again.')
    } finally {
      setLoadingTasks(false)
    }
  }

  const addTask = async (taskData: Omit<Task, 'id'>) => {
    try {
      const res = await apiRequest('http://localhost:3001/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      await fetchTasks()
    } catch (err: any) {
      if (err.message === 'SESSION_EXPIRED') return
      alert('Failed to create task')
    }
  }

  const editTask = async (id: number, updatedData: Partial<Task>) => {
    try {
      const res = await apiRequest(`http://localhost:3001/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedData),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      await fetchTasks()
    } catch (err: any) {
      if (err.message === 'SESSION_EXPIRED') return
      alert('Failed to update task')
    }
  }

  const deleteTask = async (id: number) => {
    if (!confirm('Delete this task?')) return
    try {
      const res = await apiRequest(`http://localhost:3001/tasks/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      await fetchTasks()
    } catch (err: any) {
      if (err.message === 'SESSION_EXPIRED') return
      alert('Failed to delete task')
    }
  }

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login')
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) fetchTasks()
  }, [isAuthenticated])

  if (authLoading || (isAuthenticated && loadingTasks)) {
    return <div className="min-h-screen flex items-center justify-center">Loading tasks...</div>
  }
  if (!isAuthenticated) return null

  const handleAddTask = (taskData: Omit<Task, 'id'>) => {
    addTask(taskData)
    setIsModalOpen(false)
  }

  const handleEditTask = (taskData: Omit<Task, 'id'>) => {
    if (editingTask) {
      editTask(editingTask.id, taskData)
      setEditingTask(null)
      setIsModalOpen(false)
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Task Management</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} /> Create Task
          </button>
        </div>
        {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-6">{error}</div>}
        <div className="bg-white rounded-lg shadow">
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No tasks found. Create your first task!</div>
          ) : (
            <TaskTable
              tasks={tasks}
              onEdit={(task) => {
                setEditingTask(task)
                setIsModalOpen(true)
              }}
              onDelete={deleteTask}
            />
          )}
        </div>
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingTask(null)
          }}
          onSubmit={editingTask ? handleEditTask : handleAddTask}
          initialData={editingTask}
        />
      </main>
    </div>
  )
}
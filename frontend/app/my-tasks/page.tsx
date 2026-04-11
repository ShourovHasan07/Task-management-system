'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from '../components/Sidebar'
import TaskTable from '../components/TaskTable'

// Task interface matching your backend response
interface Task {
  id: number
  title: string
  assignee: string
  status: string
  description: string
}

export default function MyTasksPage() {
  const { isAuthenticated, loading: authLoading, user } = useAuth()
  const router = useRouter()

  const [tasks, setTasks] = useState<Task[]>([])
  const [loadingTasks, setLoadingTasks] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all tasks from backend
  const fetchTasks = async () => {
    try {
      setLoadingTasks(true)
      setError(null)
      const res = await fetch('http://localhost:3001/tasks', {
        credentials: 'include', // send cookie for auth
      })
      if (!res.ok) {
        throw new Error(`Failed to fetch tasks: ${res.status}`)
      }
      const data = await res.json()
      // Assuming the API returns an array of tasks
      setTasks(Array.isArray(data) ? data : data.tasks || [])
    } catch (err) {
      console.error('Error fetching tasks:', err)
      setError('Unable to load tasks. Please try again later.')
    } finally {
      setLoadingTasks(false)
    }
  }

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
    if (isAuthenticated) {
      fetchTasks()
    }
  }, [isAuthenticated, authLoading, router])

  // Filter tasks assigned to the current user
  const myTasks = tasks.filter(task => task.assignee === user?.name)

  // Edit task (only title for simplicity, but you can extend)
  const handleEdit = async (task: Task) => {
    const newTitle = prompt('Edit task title:', task.title)
    if (!newTitle || newTitle === task.title) return

    try {
      const res = await fetch(`http://localhost:3001/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, title: newTitle }),
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Update failed')
      // Refresh tasks after successful update
      await fetchTasks()
    } catch (err) {
      console.error('Error updating task:', err)
      alert('Failed to update task. Please try again.')
    }
  }

  // Delete task
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      const res = await fetch(`http://localhost:3001/tasks/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Delete failed')
      // Refresh tasks after deletion
      await fetchTasks()
    } catch (err) {
      console.error('Error deleting task:', err)
      alert('Failed to delete task. Please try again.')
    }
  }

  if (authLoading || (isAuthenticated && loadingTasks)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading tasks...</div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">My Tasks</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          {myTasks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No tasks assigned to you
            </div>
          ) : (
            <TaskTable
              tasks={myTasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>
    </div>
  )
}
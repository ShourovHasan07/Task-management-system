'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { useTasks } from '../contexts/TaskContext'
import Sidebar from '../components/Sidebar'
import { User, CheckSquare, Clock } from 'lucide-react'

export default function UserDashboardPage() {
  const { isAuthenticated, loading, user } = useAuth()
  const { tasks } = useTasks()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading || !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const myTasks = tasks.filter(task => task.assignee === user?.name)
  const inProgressTasks = myTasks.filter(t => t.status === 'In Progress').length

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">User Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Welcome back,</p>
                <p className="text-xl font-bold">{user?.name}</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Assigned Tasks</p>
                <p className="text-3xl font-bold mt-1">{myTasks.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckSquare className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">In Progress</p>
                <p className="text-3xl font-bold mt-1">{inProgressTasks}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">My Tasks</h2>
          </div>
          <div className="divide-y">
            {myTasks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No tasks assigned to you</div>
            ) : (
              myTasks.map((task) => (
                <div key={task.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-gray-500">{task.description}</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      {task.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
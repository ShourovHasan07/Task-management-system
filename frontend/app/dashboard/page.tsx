'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { useTasks } from '../contexts/TaskContext'
import Sidebar from '../components/Sidebar'
import { CheckCircle, Clock, Users, CheckSquare } from 'lucide-react'

interface Stat {
  name: string
  value: number
  icon: React.ComponentType<{ size?: number; className?: string }>
  color: string
}

export default function DashboardPage() {
  const { isAuthenticated, loading } = useAuth()
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

  const totalTasks = tasks.length
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length
  const activeTasks = tasks.filter(t => t.status === 'Active').length
  const uniqueAssignees = [...new Set(tasks.map(t => t.assignee))].length

  const stats: Stat[] = [
    { name: 'Total Tasks', value: totalTasks, icon: CheckSquare, color: 'bg-blue-500' },
    { name: 'In Progress', value: inProgressTasks, icon: Clock, color: 'bg-yellow-500' },
    { name: 'Active Tasks', value: activeTasks, icon: CheckCircle, color: 'bg-green-500' },
    { name: 'Team Members', value: uniqueAssignees, icon: Users, color: 'bg-purple-500' },
  ]

  const recentTasks = tasks.slice(0, 5)

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">{stat.name}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Recent Tasks</h2>
          </div>
          <div className="divide-y">
            {recentTasks.map((task) => (
              <div key={task.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-500">Assignee: {task.assignee}</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { useTasks } from '../contexts/TaskContext'
import Sidebar from '../components/Sidebar'
import { Clock, Info } from 'lucide-react'

export default function AuditLogsPage() {
  const { isAuthenticated, loading } = useAuth()
  const { auditLogs } = useTasks()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading || !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const getActionColor = (action: string): string => {
    const colors: Record<string, string> = {
      'Task Created': 'bg-green-100 text-green-800',
      'Task Updated': 'bg-blue-100 text-blue-800',
      'Task Deleted': 'bg-red-100 text-red-800'
    }
    return colors[action] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Audit Logs</h1>
        
        <div className="bg-white rounded-lg shadow">
          {auditLogs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No audit logs available</div>
          ) : (
            <div className="divide-y">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getActionColor(log.action)}`}>
                      <Info size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${getActionColor(log.action)} mb-2`}>
                            {log.action}
                          </span>
                          <p className="font-medium mt-1">{log.taskTitle}</p>
                          <p className="text-sm text-gray-500">{log.details}</p>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock size={14} className="mr-1" />
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
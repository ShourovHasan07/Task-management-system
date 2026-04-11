'use client'

import { AuthProvider } from './contexts/AuthContext'
import { TaskProvider } from './contexts/TaskContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TaskProvider>{children}</TaskProvider>
    </AuthProvider>
  )
}
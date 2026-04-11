

'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Task {
  id: number
  title: string
  assignee: string
  status: string
  description: string
}

export interface AuditLog {
  id: number
  action: string
  taskTitle: string
  details: string
  timestamp: string
}

interface TaskContextType {
  tasks: Task[]
  auditLogs: AuditLog[]
  addTask: (task: Omit<Task, 'id'>) => void
  editTask: (id: number, updatedTask: Partial<Task>) => void
  deleteTask: (id: number) => void
  addLog: (action: string, taskTitle: string, details: string) => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

const initialTasks: Task[] = [
  { id: 1, title: 'Task Management', assignee: 'Admin', status: 'In Progress', description: 'Implement task management features' },
  { id: 2, title: 'Design New UI', assignee: 'Designer', status: 'Active', description: 'Create new admin dashboard UI' },
  { id: 3, title: 'Audit Logs', assignee: 'Admin', status: 'In Progress', description: 'Implement audit logging system' },
  { id: 4, title: 'User Dashboard', assignee: 'Developer', status: 'In Progress', description: 'Build user dashboard views' },
  { id: 5, title: 'Code Review', assignee: 'Lead', status: 'In Progress', description: 'Review code for QA' },
]

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks')
    const storedLogs = localStorage.getItem('auditLogs')
    
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    } else {
      setTasks(initialTasks)
      localStorage.setItem('tasks', JSON.stringify(initialTasks))
    }
    
    if (storedLogs) {
      setAuditLogs(JSON.parse(storedLogs))
    } else {
      setAuditLogs([])
    }
  }, [])

  const addLog = (action: string, taskTitle: string, details: string) => {
    const newLog: AuditLog = {
      id: Date.now(),
      action,
      taskTitle,
      details,
      timestamp: new Date().toISOString()
    }
    const updatedLogs = [newLog, ...auditLogs]
    setAuditLogs(updatedLogs)
    localStorage.setItem('auditLogs', JSON.stringify(updatedLogs))
  }

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = { ...task, id: Date.now() }
    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
    addLog('Task Created', task.title, `Created task "${task.title}"`)
  }

  const editTask = (id: number, updatedTask: Partial<Task>) => {
    const oldTask = tasks.find(t => t.id === id)
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, ...updatedTask } : task
    )
    setTasks(updatedTasks)
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
    if (oldTask) {
      addLog('Task Updated', updatedTask.title || oldTask.title, `Updated task from "${oldTask.title}" to "${updatedTask.title || oldTask.title}"`)
    }
  }

  const deleteTask = (id: number) => {
    const taskToDelete = tasks.find(t => t.id === id)
    const updatedTasks = tasks.filter(task => task.id !== id)
    setTasks(updatedTasks)
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
    if (taskToDelete) {
      addLog('Task Deleted', taskToDelete.title, `Deleted task "${taskToDelete.title}"`)
    }
  }

  return (
    <TaskContext.Provider value={{ tasks, auditLogs, addTask, editTask, deleteTask, addLog }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider')
  }
  return context
}
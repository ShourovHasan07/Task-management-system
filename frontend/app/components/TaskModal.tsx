'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Task } from '../contexts/TaskContext'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (task: Omit<Task, 'id'>) => void
  initialData?: Task | null
}

export default function TaskModal({ isOpen, onClose, onSubmit, initialData = null }: TaskModalProps) {
  const [formData, setFormData] = useState<Omit<Task, 'id'>>({
    title: '',
    assignee: 'Admin',
    status: 'In Progress',
    description: ''
  })

  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData
      setFormData(rest)
    } else {
      setFormData({
        title: '',
        assignee: 'Admin',
        status: 'In Progress',
        description: ''
      })
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{initialData ? 'Edit Task' : 'Create Task'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Assignee</label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.assignee}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
            >
              <option value="Admin">Admin</option>
              <option value="Designer">Designer</option>
              <option value="Developer">Developer</option>
              <option value="Lead">Lead</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="In Progress">In Progress</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {initialData ? 'Update Task' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  )
}
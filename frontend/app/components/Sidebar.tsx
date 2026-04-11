

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { 
  LayoutDashboard, 
  CheckSquare, 
  FileText, 
  Users, 
  User, 
  LogOut 
} from 'lucide-react'

interface MenuItem {
  name: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

export default function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const router = useRouter()

  const menuItems: MenuItem[] = [
    { name: 'Admin Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Task Management', href: '/tasks', icon: CheckSquare },
    { name: 'Audit Logs', href: '/audit-logs', icon: FileText },
    { name: 'User Dashboard', href: '/user-dashboard', icon: Users },
    { name: 'My Tasks', href: '/my-tasks', icon: CheckSquare },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Gmail</h1>
        <p className="text-gray-400 text-sm">Admin Dashboard</p>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive 
                  ? 'bg-gray-800 text-white border-r-4 border-blue-500' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          )
        })}
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white w-full mt-4"
        >
          <LogOut size={18} />
          Logout
        </button>
      </nav>
    </aside>
  )
}
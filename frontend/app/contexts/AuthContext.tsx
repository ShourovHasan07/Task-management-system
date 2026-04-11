'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

export interface User {
  id: number
  name: string
  email: string
  role: 'ADMIN' | 'user'
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  clearAuth: () => void             
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Fetch profile on mount – restores session from cookie
  useEffect(() => {
    let isMounted = true
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:3001/auth/profile', {
          credentials: 'include',
        })

        if (!isMounted) return

        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
          console.log('Session restored:', data.user)
        } else if (res.status === 401) {
          console.log('No active session')
          setUser(null)
        } else {
          throw new Error(`Profile fetch failed: ${res.status}`)
        }
      } catch (error) {
        console.error('Profile fetch error:', error)
        setUser(null)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchProfile()

    return () => { isMounted = false }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      if (res.ok) {
        const data = await res.json()
        const loggedInUser = data.user as User
        setUser(loggedInUser)

        if (loggedInUser.role === 'ADMIN') {
          router.push('/dashboard')
        } else {
          router.push('/user-dashboard')
        }
        return true
      } else {
        const errorText = await res.text()
        console.error('Login failed:', res.status, errorText)
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await fetch('http://localhost:3001/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      router.push('/login')
    }
  }

  // 👇 New function: clears auth state without calling backend (for 401 responses)
  const clearAuth = (): void => {
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        clearAuth,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
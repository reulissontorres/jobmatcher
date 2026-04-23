'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authLogin, authRegister } from '@/lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    const storedUser = localStorage.getItem('jobmatcher_user')
    const storedToken = localStorage.getItem('jobmatcher_token')
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {}
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const data = await authLogin(email, password)
      const token = data?.token ?? data?.Token
      const userData = data?.user ?? data?.User
      if (!token) {
        throw new Error('Token não recebido do servidor')
      }

      setUser(userData)
      localStorage.setItem('jobmatcher_token', token)
      localStorage.setItem('jobmatcher_user', JSON.stringify(userData))
      return userData
    } catch (err) {
      throw new Error(err?.message ?? 'Erro ao efetuar login')
    }
  }

  const register = async (organizationName, organizationType, email, password) => {
    try {
      const data = await authRegister(organizationName, email, password, organizationName)
      // Do not auto-login here; redirect user to login page after successful registration
      return data
    } catch (err) {
      throw new Error(err?.message ?? 'Erro ao registrar')
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('jobmatcher_token')
    localStorage.removeItem('jobmatcher_user')
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in (simulated with sessionStorage)
    const storedUser = sessionStorage.getItem('jobmatcher_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    // Simulated login - in production, this would call an API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Get registered organizations from sessionStorage
        const orgs = JSON.parse(sessionStorage.getItem('jobmatcher_orgs') || '[]')
        const foundOrg = orgs.find(org => org.email === email && org.password === password)
        
        if (foundOrg) {
          const userData = {
            email: foundOrg.email,
            organizationName: foundOrg.organizationName,
            organizationType: foundOrg.organizationType
          }
          setUser(userData)
          sessionStorage.setItem('jobmatcher_user', JSON.stringify(userData))
          resolve(userData)
        } else {
          // Allow demo login
          if (email === 'demo@company.com' && password === 'demo123') {
            const userData = {
              email: 'demo@company.com',
              organizationName: 'Demo Organization',
              organizationType: 'company'
            }
            setUser(userData)
            sessionStorage.setItem('jobmatcher_user', JSON.stringify(userData))
            resolve(userData)
          } else {
            reject(new Error('Email ou senha inválidos'))
          }
        }
      }, 500)
    })
  }

  const register = (organizationName, organizationType, email, password) => {
    // Simulated registration - in production, this would call an API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const orgs = JSON.parse(sessionStorage.getItem('jobmatcher_orgs') || '[]')
        
        if (orgs.find(org => org.email === email)) {
          reject(new Error('Este email já está cadastrado'))
          return
        }

        const newOrg = {
          organizationName,
          organizationType,
          email,
          password
        }
        
        orgs.push(newOrg)
        sessionStorage.setItem('jobmatcher_orgs', JSON.stringify(orgs))
        
        const userData = {
          email,
          organizationName,
          organizationType
        }
        setUser(userData)
        sessionStorage.setItem('jobmatcher_user', JSON.stringify(userData))
        resolve(userData)
      }, 500)
    })
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('jobmatcher_user')
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

import React, { createContext, useState, useEffect, useContext } from 'react'
import * as authService from '../services/authService'
import { setAuthToken } from '../services/apiClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      setAuthToken(token)
    } else {
      localStorage.removeItem('token')
      setAuthToken(null)
      setUser(null)
      localStorage.removeItem('user')
    }
  }, [token])

  useEffect(() => {
    try {
      if (user) localStorage.setItem('user', JSON.stringify(user))
      else localStorage.removeItem('user')
    } catch {
      // ignore serialization errors
    }
  }, [user])

  async function login(credentials) {
    const data = await authService.login(credentials)
    if (data?.token || data?.accessToken) {
      const t = data.token ?? data.accessToken
      setToken(t)
      if (data.user) setUser(data.user)
      return data
    }
    return null
  }

  async function register(payload) {
    const data = await authService.register(payload)
    // API returns AuthResponse on success — auto-login behavior: store token + user
    if (data?.token || data?.accessToken) {
      const t = data.token ?? data.accessToken
      setToken(t)
      if (data.user) setUser(data.user)
    }
    return data
  }

  function logout() {
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
export default AuthContext

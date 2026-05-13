import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function NavBar() {
  const { user, logout } = useAuth()
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="font-bold">JobMatcher</Link>
        <div className="flex items-center gap-4">
          <Link to="/jobs" className="text-sm text-gray-700">Vagas</Link>
          <Link to="/candidates" className="text-sm text-gray-700">Candidatos</Link>
          {user ? (
            <>
              <button onClick={logout} className="text-sm text-red-600">Sair</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-700">Entrar</Link>
              <Link to="/register" className="text-sm text-gray-700">Registrar</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

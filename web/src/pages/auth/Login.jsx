import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { login } = useAuthContext()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const res = await login({ email, password })
      if (res) navigate('/')
    } catch (err) {
      setError(err?.response?.data?.error || 'Erro ao autenticar')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Entrar</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 rounded" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" type="password" className="w-full border p-2 rounded" />
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded">Entrar</button>
        </div>
      </form>
    </div>
  )
}

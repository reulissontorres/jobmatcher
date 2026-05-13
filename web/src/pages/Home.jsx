import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-4">JobMatcher</h1>
      <p className="mb-6">Painel inicial. Explore vagas e candidatos.</p>
      <div className="flex gap-4">
        <Link to="/jobs" className="px-4 py-2 bg-indigo-600 text-white rounded">Ver Vagas</Link>
        <Link to="/candidates" className="px-4 py-2 border rounded">Ver Candidatos</Link>
      </div>
    </div>
  )
}

import React from 'react'
import NavBar from './NavBar'

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="container mx-auto p-4">{children}</main>
    </div>
  )
}

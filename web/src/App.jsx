import React from 'react'
import AppRoutes from './routes/AppRoutes'
import AppLayout from './components/layout/AppLayout'

export default function App() {
  return (
    <AppLayout>
      <AppRoutes />
    </AppLayout>
  )
}

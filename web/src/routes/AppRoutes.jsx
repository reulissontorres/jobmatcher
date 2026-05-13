import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import JobsList from '../pages/jobs/JobsList'
import JobDetails from '../pages/jobs/JobDetails'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import { useAuth } from '../hooks/useAuth'

function PrivateRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/jobs" element={<JobsList />} />
      <Route path="/jobs/:id" element={<JobDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/applications" element={<PrivateRoute><div>Applications (protected)</div></PrivateRoute>} />
      <Route path="/matching" element={<PrivateRoute><div>Matching (protected)</div></PrivateRoute>} />
    </Routes>
  )
}

import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LoadingSpinner } from '../ui'
import AdminLayout from './AdminLayout'

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Redirect to dashboard if not admin
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  // Render admin layout with children
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  )
}

export default AdminRoute

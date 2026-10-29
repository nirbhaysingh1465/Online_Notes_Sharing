/**
 * ProtectedRoute Component
 * 
 * Wraps pages that require authentication.
 * If the user is not logged in, they are redirected to the login page.
 * If adminOnly is true, non-admin users are redirected to the home page.
 */

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from './LoadingSpinner'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking auth status
  if (loading) {
    return <LoadingSpinner fullPage message="Checking authentication..." />
  }

  // Not logged in? Redirect to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Admin-only page but user is not admin? Redirect to home
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />
  }

  // User is authenticated (and admin if required) — show the page
  return children
}

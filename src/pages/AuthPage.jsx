/**
 * Authentication Page (Login, Sign Up & Password Reset)
 * 
 * Provides:
 * - Student registration with display name
 * - Student login
 * - Quick 1-click Demo Student & Demo Admin logins for easy testing
 * - Password reset request
 * - Responsive cards, animations & validation
 */

import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  BookOpen,
  Mail,
  Lock,
  User,
  ArrowRight,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { isValidEmail } from '../utils/helpers'

export default function AuthPage({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode) // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const { signIn, signUp, resetPassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const destination = location.state?.from?.pathname || '/dashboard'

  // Form submit handler
  async function handleSubmit(e) {
    e.preventDefault()

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    if (mode === 'forgot') {
      setIsSubmitting(true)
      try {
        const { error } = await resetPassword(email)
        if (error) throw error
        setResetSent(true)
        toast.success('Password reset email sent! Check your inbox.')
      } catch (err) {
        toast.error(err.message || 'Failed to send reset email')
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    if (mode === 'register' && !displayName.trim()) {
      toast.error('Please enter your full name')
      return
    }

    setIsSubmitting(true)

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password)
        if (error) throw error
        toast.success('Welcome back to ShareNotes!')
        navigate(destination, { replace: true })
      } else {
        const { error } = await signUp(email, password, displayName)
        if (error) throw error
        toast.success('Account created successfully!')
        navigate('/dashboard', { replace: true })
      }
    } catch (err) {
      toast.error(err.message || 'Authentication failed. Please verify credentials.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Quick 1-click test helpers
  async function handleQuickLogin(userType) {
    setIsSubmitting(true)
    try {
      if (userType === 'student') {
        await signIn('raj.patel@sharenotes.edu', 'student123')
        toast.success('Logged in as Demo Student (Raj Patel)')
      } else {
        await signIn('admin@sharenotes.edu', 'admin123')
        toast.success('Logged in as Administrator')
      }
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error('Quick login failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-secondary-200 shadow-card">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-600 mb-2">
            <BookOpen className="w-8 h-8" strokeWidth={2.2} />
            <span className="text-2xl font-bold tracking-tight">ShareNotes</span>
          </Link>
          <h2 className="text-xl font-bold text-secondary-900 mt-2">
            {mode === 'login' && 'Sign in to your account'}
            {mode === 'register' && 'Create your student account'}
            {mode === 'forgot' && 'Reset your password'}
          </h2>
          <p className="text-xs text-secondary-500 mt-1">
            {mode === 'login' && 'Access and download verified college notes'}
            {mode === 'register' && 'Join your classmates and start sharing study notes'}
            {mode === 'forgot' && "We'll send password recovery instructions"}
          </p>
        </div>

        {/* Mode Switch Tabs */}
        {mode !== 'forgot' && (
          <div className="flex bg-secondary-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-secondary-900 shadow-sm'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white text-secondary-900 shadow-sm'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Password Reset Success Notice */}
        {mode === 'forgot' && resetSent ? (
          <div className="bg-success-50 border border-success-200 rounded-xl p-4 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-success-600 mx-auto" />
            <p className="text-sm font-medium text-success-900">Check your email</p>
            <p className="text-xs text-success-700">
              We sent a password reset link to <b>{email}</b>. Please check your inbox and spam folder.
            </p>
            <button
              type="button"
              onClick={() => { setMode('login'); setResetSent(false) }}
              className="text-xs font-semibold text-primary-600 hover:underline pt-2 block mx-auto"
            >
              Return to Login
            </button>
          </div>
        ) : (
          /* Main Form */
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {/* Display Name field (Registration only) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-secondary-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-9 pr-3 py-2.5 bg-secondary-50 border border-secondary-300 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-xs font-semibold text-secondary-700 mb-1">
                College or Personal Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full pl-9 pr-3 py-2.5 bg-secondary-50 border border-secondary-300 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Password field */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-secondary-700">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs font-medium text-primary-600 hover:text-primary-700"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-secondary-50 border border-secondary-300 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                'Processing...'
              ) : (
                <>
                  {mode === 'login' && 'Sign In'}
                  {mode === 'register' && 'Create Account'}
                  {mode === 'forgot' && 'Send Reset Link'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Back to Login from Forgot */}
        {mode === 'forgot' && !resetSent && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-xs text-secondary-600 hover:text-secondary-900 font-medium"
            >
              ← Back to Login
            </button>
          </div>
        )}

        {/* Quick Testing Panel for Evaluation / College Viva */}
        <div className="pt-4 border-t border-secondary-200">
          <p className="text-[11px] font-semibold text-secondary-500 uppercase tracking-wider mb-2 text-center">
            Quick 1-Click Evaluation Logins
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('student')}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-secondary-50 hover:bg-secondary-100 border border-secondary-200 rounded-lg text-xs font-medium text-secondary-700 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-primary-600" />
              Demo Student (Raj Patel)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-secondary-50 hover:bg-secondary-100 border border-secondary-200 rounded-lg text-xs font-medium text-secondary-700 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-danger-600" />
              Demo Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

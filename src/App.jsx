/**
 * ShareNotes - Main Application Component
 * 
 * Provides:
 * - Routing using react-router-dom
 * - Authentication Provider wrapping the app
 * - Notification Toaster (react-hot-toast)
 * - Navigation bar and Footer
 * - Protected routes for student uploads, dashboard, profile, and admin panel
 */

import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { isSupabaseConfigured } from './lib/supabase'

// Layout Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/common/ProtectedRoute'

// Pages
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import NotesExplorerPage from './pages/NotesExplorerPage'
import NoteDetailPage from './pages/NoteDetailPage'
import UploadPage from './pages/UploadPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-secondary-50 text-secondary-900 font-sans">
          {/* Notification Toaster */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#0F172A',
                color: '#FFFFFF',
                fontSize: '13px',
                borderRadius: '10px',
                padding: '12px 16px',
              },
            }}
          />

          {/* Local Mode Notice Banner (Disappears when live Supabase keys are set) */}
          {!isSupabaseConfigured && (
            <div className="bg-primary-900 text-primary-100 text-[11px] py-1.5 px-4 text-center border-b border-primary-800">
              <span className="font-semibold">🚀 Local Interactive Mode:</span> All features (PDF downloads, uploads, search, ratings, favorites & admin panel) are fully functional with local persistent data. Connect your cloud database anytime in <code className="bg-primary-800 px-1 py-0.5 rounded text-white font-mono">.env</code>.
            </div>
          )}

          {/* Top Sticky Navigation */}
          <Navbar />

          {/* Dynamic Page Content */}
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<NotesExplorerPage />} />
              <Route path="/notes/:id" element={<NoteDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Authentication Routes */}
              <Route path="/login" element={<AuthPage initialMode="login" />} />
              <Route path="/register" element={<AuthPage initialMode="register" />} />

              {/* Protected Student Routes */}
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <UploadPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Administrator Route */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  )
}

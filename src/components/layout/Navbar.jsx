/**
 * Navbar Component — ShareNotes
 * 
 * Features:
 * - Brand logo & name: ShareNotes ("Share Knowledge. Grow Together.")
 * - Navigation links (Explore, Upload)
 * - User avatar with dropdown menu (Dashboard, Profile, Admin, Sign Out)
 * - Responsive mobile navigation menu
 */

import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  BookOpen,
  FileText,
  Upload,
  Search,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Shield,
  ChevronDown,
  Sparkles
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getInitials } from '../../utils/helpers'

export default function Navbar() {
  const { user, profile, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  // Handle sign out
  async function handleSignOut() {
    await signOut()
    setProfileDropdownOpen(false)
    navigate('/')
  }

  // Check if a nav link is currently active
  function isActive(path) {
    return location.pathname === path
  }

  const navLinks = [
    { path: '/explore', label: 'Explore Notes', icon: Search },
    { path: '/upload', label: 'Upload Notes', icon: Upload, requiresAuth: true },
    { path: '/about', label: 'About', icon: BookOpen },
    { path: '/contact', label: 'Contact', icon: FileText },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-secondary-200 shadow-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-primary-600 hover:text-primary-700 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-700 via-primary-600 to-blue-500 text-white flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
              <BookOpen className="w-5 h-5" strokeWidth={2.4} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-secondary-900 group-hover:text-primary-600 transition-colors">
                Share<span className="text-primary-600">Notes</span>
              </span>
              <span className="text-[10px] text-secondary-500 font-medium tracking-wide -mt-1 hidden sm:block">
                Share Knowledge. Grow Together.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.requiresAuth && !user) return null
              const Icon = link.icon
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              /* User Menu Dropdown */
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-secondary-200 hover:bg-secondary-50 transition-colors"
                  id="user-menu-button"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold">
                    {getInitials(profile?.display_name || user.email || 'Raj')}
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-secondary-900 block max-w-[120px] truncate leading-tight">
                      {profile?.display_name || 'Raj Patel'}
                    </span>
                    <span className="text-[10px] text-secondary-500 block leading-tight">
                      {profile?.branch || 'CSE'}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-secondary-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-secondary-200 py-2 z-20 animate-scale-in">
                      <div className="px-4 py-2.5 border-b border-secondary-100">
                        <p className="text-xs font-bold text-secondary-900 truncate">
                          {profile?.display_name || 'Raj Patel'}
                        </p>
                        <p className="text-[11px] text-secondary-500 truncate">
                          {profile?.college_name || 'Ambalika Institute of Technology'}
                        </p>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-primary-600" />
                        Student Dashboard
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-primary-600" />
                        My Profile
                      </Link>

                      <Link
                        to="/upload"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
                      >
                        <Upload className="w-4 h-4 text-primary-600" />
                        Upload Notes
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
                        >
                          <Shield className="w-4 h-4 text-danger-600" />
                          Admin Panel
                        </Link>
                      )}

                      <div className="border-t border-secondary-100 mt-1 pt-1">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-danger-600 hover:bg-danger-50 w-full transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Guest Actions */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-secondary-700 hover:text-secondary-900 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-sm hover:shadow"
                >
                  Demo Dashboard
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-secondary-600 hover:bg-secondary-50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-secondary-200 bg-white animate-slide-down">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-secondary-600 hover:bg-secondary-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold text-secondary-600 hover:bg-secondary-50"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard (Raj Patel)
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold text-secondary-600 hover:bg-secondary-50"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
                <button
                  onClick={() => { handleSignOut(); setMobileMenuOpen(false) }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold text-danger-600 hover:bg-danger-50 w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2 border-t border-secondary-100">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2.5 text-xs font-bold text-secondary-700 border border-secondary-300 rounded-xl hover:bg-secondary-50"
                >
                  Log In
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl"
                >
                  Demo Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

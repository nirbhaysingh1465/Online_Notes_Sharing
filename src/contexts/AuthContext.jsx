/**
 * Auth Context
 * 
 * This React Context provides authentication state (current user, loading status)
 * to all components in the app without passing props manually.
 * 
 * How it works:
 * 1. When the app loads, it checks if the user is already logged in.
 * 2. It listens for auth changes (login, logout, token refresh).
 * 3. When a user logs in, it fetches their profile from the database.
 * 4. Any component can use the useAuth() hook to access user data.
 */

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// Create the context (like a shared data container)
const AuthContext = createContext({})

/**
 * AuthProvider wraps the entire app and provides auth data to all children.
 */
export function AuthProvider({ children }) {
  // State to track the current user, their profile, and loading status
  const [user, setUser] = useState(null)          // Supabase auth user object
  const [profile, setProfile] = useState(null)    // User's profile from our database
  const [userRole, setUserRole] = useState(null)   // 'admin' or 'student'
  const [loading, setLoading] = useState(true)     // True while checking auth status

  // Fetch the user's profile and role from our database
  async function fetchProfile(userId) {
    try {
      // Get profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        // PGRST116 means "no rows found" — that's OK for new users
        console.error('Error fetching profile:', profileError)
      }

      setProfile(profileData || null)

      // Get user role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single()

      if (roleError && roleError.code !== 'PGRST116') {
        console.error('Error fetching role:', roleError)
      }

      setUserRole(roleData?.role || 'student')
    } catch (error) {
      console.error('Error in fetchProfile:', error)
    }
  }

  useEffect(() => {
    // 1. Check if user is already logged in when app loads
    async function getInitialSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id)
        }
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // 2. Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
          setUserRole(null)
        }
        setLoading(false)
      }
    )

    // 3. Cleanup: unsubscribe when component unmounts
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Sign up a new user
  async function signUp(email, password, displayName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    })
    return { data, error }
  }

  // Sign in an existing user
  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  // Sign out
  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
      setProfile(null)
      setUserRole(null)
    }
    return { error }
  }

  // Reset password
  async function resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  }

  // Refresh profile data (call after updating profile)
  async function refreshProfile() {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  // The value object that all components can access
  const value = {
    user,           // The auth user object (has id, email, etc.)
    profile,        // The profile from our database (display_name, college, etc.)
    userRole,       // 'admin' or 'student'
    loading,        // True while checking auth
    isAdmin: userRole === 'admin',
    signUp,
    signIn,
    signOut,
    resetPassword,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Custom hook to use auth context.
 * Usage: const { user, signIn, signOut } = useAuth()
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

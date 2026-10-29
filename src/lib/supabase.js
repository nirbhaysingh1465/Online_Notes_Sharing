/**
 * ShareNotes — Supabase Client & Resilient Fallback Engine
 * 
 * When valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are provided in .env,
 * this delegates to the cloud Supabase client (PostgreSQL, Auth, and Storage).
 * 
 * If credentials are not yet configured or during college viva demonstration,
 * it runs in local persistent mode with demonstration student Raj Patel
 * (Ambalika Institute of Technology and Management, Lucknow) and 6 curated CSE notes.
 */

import { createClient } from '@supabase/supabase-js'
import {
  INITIAL_NOTES,
  INITIAL_PROFILES,
  INITIAL_RATINGS,
  DEMO_STUDENT_PROFILE,
  getSamplePdfBlob
} from '../data/mockData'

const envUrl = import.meta.env.VITE_SUPABASE_URL
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const hasValidSupabaseConfig = Boolean(
  envUrl &&
  envKey &&
  !envUrl.includes('your-project-id') &&
  !envKey.includes('your-anon-key') &&
  envUrl.startsWith('http')
)

export const isSupabaseConfigured = hasValidSupabaseConfig

// Real client if configured
let realClient = null
if (hasValidSupabaseConfig) {
  try {
    realClient = createClient(envUrl, envKey)
  } catch (err) {
    console.warn('Failed to initialize Supabase client, falling back to demo mode:', err)
  }
}

// -------------------------------------------------------------
// LOCAL DEMONSTRATION ENGINE (localStorage backed)
// -------------------------------------------------------------
const STORAGE_KEYS = {
  NOTES: 'sharenotes_notes',
  PROFILES: 'sharenotes_profiles',
  RATINGS: 'sharenotes_ratings',
  FAVORITES: 'sharenotes_favorites',
  DOWNLOADS: 'sharenotes_downloads',
  REPORTS: 'sharenotes_reports',
  USER_ROLES: 'sharenotes_user_roles',
  AUTH_SESSION: 'sharenotes_auth_session',
}

function loadStorage(key, defaultVal) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : defaultVal
  } catch (e) {
    return defaultVal
  }
}

function saveStorage(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val))
  } catch (e) {
    console.error('Storage error:', e)
  }
}

// Reset / Seed initial demonstration data
if (typeof window !== 'undefined') {
  // Always ensure demo profile and notes exist
  saveStorage(STORAGE_KEYS.NOTES, INITIAL_NOTES)
  saveStorage(STORAGE_KEYS.PROFILES, INITIAL_PROFILES)
  saveStorage(STORAGE_KEYS.RATINGS, INITIAL_RATINGS)

  if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
    saveStorage(STORAGE_KEYS.FAVORITES, [
      { id: 'fav-1', user_id: DEMO_STUDENT_PROFILE.id, note_id: 'note-3', created_at: new Date().toISOString() },
      { id: 'fav-2', user_id: DEMO_STUDENT_PROFILE.id, note_id: 'note-5', created_at: new Date().toISOString() }
    ])
  }
  if (!localStorage.getItem(STORAGE_KEYS.DOWNLOADS)) {
    saveStorage(STORAGE_KEYS.DOWNLOADS, [])
  }
  if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
    saveStorage(STORAGE_KEYS.REPORTS, [])
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER_ROLES)) {
    saveStorage(STORAGE_KEYS.USER_ROLES, [
      { user_id: 'user-admin', role: 'admin' },
      { user_id: DEMO_STUDENT_PROFILE.id, role: 'student' }
    ])
  }
}

class MockQueryBuilder {
  constructor(table) {
    this.table = table
    this.filters = []
    this.orders = []
    this.limitCount = null
    this.isSingle = false
    this.isHead = false
    this.countMode = null
    this.selectedFields = '*'
  }

  select(fields = '*', options = {}) {
    this.selectedFields = fields
    if (options.count) this.countMode = options.count
    if (options.head) this.isHead = options.head
    return this
  }

  eq(column, value) {
    this.filters.push(item => item[column] === value)
    return this
  }

  neq(column, value) {
    this.filters.push(item => item[column] !== value)
    return this
  }

  in(column, values) {
    this.filters.push(item => values.includes(item[column]))
    return this
  }

  ilike(column, pattern) {
    const cleanPattern = pattern.replace(/%/g, '').toLowerCase()
    this.filters.push(item => {
      const val = item[column]
      return val && String(val).toLowerCase().includes(cleanPattern)
    })
    return this
  }

  or(conditions) {
    const parts = conditions.split(',')
    this.filters.push(item => {
      return parts.some(part => {
        const [field, op, val] = part.split('.')
        const searchVal = (val || '').replace(/%/g, '').toLowerCase()
        const actualVal = String(item[field] || '').toLowerCase()
        return actualVal.includes(searchVal)
      })
    })
    return this
  }

  order(column, { ascending = true } = {}) {
    this.orders.push({ column, ascending })
    return this
  }

  limit(count) {
    this.limitCount = count
    return this
  }

  single() {
    this.isSingle = true
    return this
  }

  async insert(rows) {
    const list = Array.isArray(rows) ? rows : [rows]
    const current = loadStorage(`sharenotes_${this.table}`, [])
    const inserted = list.map(r => ({
      id: r.id || `${this.table}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      created_at: r.created_at || new Date().toISOString(),
      ...r
    }))
    const updated = [...inserted, ...current]
    saveStorage(`sharenotes_${this.table}`, updated)
    return { data: this.isSingle ? inserted[0] : inserted, error: null }
  }

  async update(updates) {
    const current = loadStorage(`sharenotes_${this.table}`, [])
    const updated = current.map(item => {
      const matches = this.filters.every(f => f(item))
      if (matches) {
        return { ...item, ...updates, updated_at: new Date().toISOString() }
      }
      return item
    })
    saveStorage(`sharenotes_${this.table}`, updated)
    return { data: updated, error: null }
  }

  async delete() {
    const current = loadStorage(`sharenotes_${this.table}`, [])
    const remaining = current.filter(item => !this.filters.every(f => f(item)))
    saveStorage(`sharenotes_${this.table}`, remaining)
    return { data: null, error: null }
  }

  async then(resolve) {
    let items = loadStorage(`sharenotes_${this.table}`, [])

    // Apply filters
    for (const filter of this.filters) {
      items = items.filter(filter)
    }

    const totalCount = items.length

    if (this.isHead) {
      return resolve({ count: totalCount, data: null, error: null })
    }

    // Apply orders
    for (const { column, ascending } of this.orders) {
      items.sort((a, b) => {
        const valA = a[column]
        const valB = b[column]
        if (valA < valB) return ascending ? -1 : 1
        if (valA > valB) return ascending ? 1 : -1
        return 0
      })
    }

    // Apply limit
    if (this.limitCount !== null) {
      items = items.slice(0, this.limitCount)
    }

    // Embed profiles relation if requested
    if (this.selectedFields.includes('profiles')) {
      const profiles = loadStorage(STORAGE_KEYS.PROFILES, INITIAL_PROFILES)
      items = items.map(item => {
        const prof = profiles.find(p => p.id === (item.uploader_id || item.user_id))
        return {
          ...item,
          profiles: prof || { display_name: 'Student', college_name: 'Ambalika Institute of Technology and Management, Lucknow' }
        }
      })
    }

    if (this.isSingle) {
      if (items.length === 0) {
        return resolve({ data: null, error: { code: 'PGRST116', message: 'Row not found' } })
      }
      return resolve({ data: items[0], error: null })
    }

    return resolve({ data: items, count: totalCount, error: null })
  }
}

// Mock Auth system
const mockAuth = {
  listeners: [],
  onAuthStateChange(callback) {
    this.listeners.push(callback)
    const session = loadStorage(STORAGE_KEYS.AUTH_SESSION, null)
    if (session) {
      setTimeout(() => callback('SIGNED_IN', session), 0)
    }
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.listeners = this.listeners.filter(l => l !== callback)
          }
        }
      }
    }
  },

  async getSession() {
    const session = loadStorage(STORAGE_KEYS.AUTH_SESSION, null)
    return { data: { session }, error: null }
  },

  async signUp({ email, password, options = {} }) {
    const id = `user-${Date.now()}`
    const displayName = options.data?.display_name || email.split('@')[0]
    const user = {
      id,
      email,
      user_metadata: { display_name: displayName }
    }
    const session = { user, access_token: 'demo-token' }

    const profiles = loadStorage(STORAGE_KEYS.PROFILES, INITIAL_PROFILES)
    profiles.push({
      id,
      display_name: displayName,
      college_name: 'Ambalika Institute of Technology and Management, Lucknow',
      branch: 'Computer Science and Engineering (CSE)',
      semester: 3,
      avatar_url: '',
      created_at: new Date().toISOString()
    })
    saveStorage(STORAGE_KEYS.PROFILES, profiles)

    saveStorage(STORAGE_KEYS.AUTH_SESSION, session)
    this.listeners.forEach(cb => cb('SIGNED_IN', session))
    return { data: { user, session }, error: null }
  },

  async signInWithPassword({ email, password }) {
    const isAdminUser = email.toLowerCase().includes('admin')
    const user = isAdminUser
      ? { id: 'user-admin', email, user_metadata: { display_name: 'Admin ShareNotes' } }
      : { id: DEMO_STUDENT_PROFILE.id, email: 'raj.patel@sharenotes.edu', user_metadata: { display_name: DEMO_STUDENT_PROFILE.display_name } }

    const session = { user, access_token: 'demo-token' }
    saveStorage(STORAGE_KEYS.AUTH_SESSION, session)
    this.listeners.forEach(cb => cb('SIGNED_IN', session))
    return { data: { user, session }, error: null }
  },

  async signOut() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION)
    this.listeners.forEach(cb => cb('SIGNED_OUT', null))
    return { error: null }
  },

  async resetPasswordForEmail(email) {
    return { data: {}, error: null }
  }
}

// Mock Storage system
const mockStorage = {
  from(bucket) {
    return {
      async upload(path, file) {
        return { data: { path }, error: null }
      },
      getPublicUrl(path) {
        return {
          data: {
            publicUrl: URL.createObjectURL(getSamplePdfBlob())
          }
        }
      },
      async remove(paths) {
        return { data: paths, error: null }
      }
    }
  }
}

const mockClient = {
  from(table) {
    return new MockQueryBuilder(table)
  },
  auth: mockAuth,
  storage: mockStorage
}

export const supabase = realClient || mockClient

/**
 * Notes Explorer Page
 * 
 * Allows students to browse, filter, search, and sort all notes.
 * Filters: Branch, Semester, Subject, File Type
 * Sorting: Newest first, Most downloaded, Highest rated
 */

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  FileText,
  RotateCcw,
  BookOpen
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import NoteCard from '../components/notes/NoteCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import EmptyState from '../components/common/EmptyState'
import {
  BRANCHES,
  SEMESTERS,
  SORT_OPTIONS,
  NOTES_PER_PAGE
} from '../utils/constants'

export default function NotesExplorerPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // State from URL query params or defaults
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedBranch, setSelectedBranch] = useState(searchParams.get('branch') || 'all')
  const [selectedSemester, setSelectedSemester] = useState(searchParams.get('semester') || 'all')
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject') || 'all')
  const [sortBy, setSortBy] = useState('newest')
  const [visibleCount, setVisibleCount] = useState(NOTES_PER_PAGE)

  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Fetch all notes with stats
  useEffect(() => {
    async function loadNotes() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('notes')
          .select(`
            *,
            profiles:uploader_id (display_name, college_name)
          `)
          .order('created_at', { ascending: false })

        if (error) throw error

        // Enrich with download counts and ratings if not present
        const enriched = await Promise.all(
          (data || []).map(async (n) => {
            if (n.download_count !== undefined && n.avg_rating !== undefined) {
              return n
            }
            const { count: dlCount } = await supabase
              .from('downloads')
              .select('*', { count: 'exact', head: true })
              .eq('note_id', n.id)

            const { data: rData } = await supabase
              .from('ratings')
              .select('rating')
              .eq('note_id', n.id)

            const avg = rData && rData.length > 0
              ? rData.reduce((s, r) => s + r.rating, 0) / rData.length
              : null

            return {
              ...n,
              download_count: dlCount || 0,
              avg_rating: avg,
              rating_count: rData?.length || 0
            }
          })
        )

        setNotes(enriched)
      } catch (err) {
        console.error('Error fetching notes:', err)
      } finally {
        setLoading(false)
      }
    }

    loadNotes()
  }, [])

  // Update URL params when search term changes
  useEffect(() => {
    const params = {}
    if (searchQuery) params.search = searchQuery
    if (selectedBranch !== 'all') params.branch = selectedBranch
    if (selectedSemester !== 'all') params.semester = selectedSemester
    if (selectedSubject !== 'all') params.subject = selectedSubject
    setSearchParams(params, { replace: true })
  }, [searchQuery, selectedBranch, selectedSemester, selectedSubject])

  // Extract unique subjects from notes list for dropdown
  const availableSubjects = useMemo(() => {
    const set = new Set()
    notes.forEach(n => {
      if (n.subject) set.add(n.subject)
    })
    return Array.from(set).sort()
  }, [notes])

  // Client-side filtering & sorting
  const filteredNotes = useMemo(() => {
    return notes
      .filter(note => {
        // Search query filter (title, description, subject, topic)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchTitle = (note.title || '').toLowerCase().includes(q)
          const matchDesc = (note.description || '').toLowerCase().includes(q)
          const matchSubject = (note.subject || '').toLowerCase().includes(q)
          const matchTopic = (note.topic || '').toLowerCase().includes(q)
          if (!matchTitle && !matchDesc && !matchSubject && !matchTopic) return false
        }

        // Branch filter
        if (selectedBranch !== 'all' && note.branch !== selectedBranch) {
          return false
        }

        // Semester filter
        if (selectedSemester !== 'all' && String(note.semester) !== String(selectedSemester)) {
          return false
        }

        // Subject filter
        if (selectedSubject !== 'all' && note.subject !== selectedSubject) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.created_at) - new Date(a.created_at)
        }
        if (sortBy === 'oldest') {
          return new Date(a.created_at) - new Date(b.created_at)
        }
        if (sortBy === 'most_downloaded') {
          return (b.download_count || 0) - (a.download_count || 0)
        }
        if (sortBy === 'highest_rated') {
          return (b.avg_rating || 0) - (a.avg_rating || 0)
        }
        return 0
      })
  }, [notes, searchQuery, selectedBranch, selectedSemester, selectedSubject, sortBy])

  // Reset all filters
  function handleResetFilters() {
    setSearchQuery('')
    setSelectedBranch('all')
    setSelectedSemester('all')
    setSelectedSubject('all')
    setSortBy('newest')
  }

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedBranch !== 'all' ||
    selectedSemester !== 'all' ||
    selectedSubject !== 'all'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Page Title & Search Bar */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight mb-2">
          Explore College Notes
        </h1>
        <p className="text-secondary-600 text-sm max-w-2xl mb-6">
          Search thousands of verified notes, laboratory manuals, and exam revision guides shared by top engineering students.
        </p>

        {/* Search input with live clear */}
        <div className="relative max-w-2xl">
          <Search className="w-5 h-5 text-secondary-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, subject, or title (e.g. Data Structures, Physics)..."
            className="w-full pl-12 pr-10 py-3.5 bg-white border border-secondary-300 rounded-xl text-secondary-900 placeholder-secondary-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Notes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Panel */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6 bg-white p-6 rounded-2xl border border-secondary-200 shadow-card h-fit sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-secondary-200">
            <div className="flex items-center gap-2 text-secondary-900 font-semibold text-sm">
              <Filter className="w-4 h-4 text-primary-600" />
              Filter Notes
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-primary-600 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* Branch Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 mb-2">
              Branch / Department
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full p-2.5 bg-secondary-50 border border-secondary-300 rounded-lg text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Branches</option>
              {BRANCHES.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Semester Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 mb-2">
              Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full p-2.5 bg-secondary-50 border border-secondary-300 rounded-lg text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Semesters</option>
              {SEMESTERS.map(s => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 mb-2">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-2.5 bg-secondary-50 border border-secondary-300 rounded-lg text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Subjects</option>
              {availableSubjects.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* File Type notice */}
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary-100 text-secondary-700 text-xs font-medium rounded-lg">
              <FileText className="w-3.5 h-3.5 text-primary-600" />
              File format: PDF only
            </span>
          </div>
        </aside>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden col-span-1 flex items-center justify-between">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-300 rounded-lg text-sm font-medium text-secondary-800 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-primary-600" />
            Filters {hasActiveFilters && '(Active)'}
          </button>
        </div>

        {/* Mobile Filters Dropdown */}
        {showMobileFilters && (
          <div className="lg:hidden col-span-1 bg-white p-5 rounded-xl border border-secondary-200 shadow-md space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm">Filters</span>
              {hasActiveFilters && (
                <button onClick={handleResetFilters} className="text-xs text-primary-600">
                  Reset All
                </button>
              )}
            </div>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm"
            >
              <option value="all">All Branches</option>
              {BRANCHES.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm"
            >
              <option value="all">All Semesters</option>
              {SEMESTERS.map(s => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>
        )}

        {/* Notes Grid Area */}
        <main className="lg:col-span-3 space-y-6">
          {/* Header Row: Count & Sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-secondary-200">
            <p className="text-sm font-medium text-secondary-600">
              Showing <span className="font-bold text-secondary-900">{filteredNotes.length}</span> {filteredNotes.length === 1 ? 'note' : 'notes'}
            </p>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-secondary-500 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 bg-white border border-secondary-300 rounded-lg text-xs font-semibold text-secondary-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid or Empty/Loading State */}
          {loading ? (
            <LoadingSpinner fullPage={false} message="Loading available notes..." />
          ) : filteredNotes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredNotes.slice(0, visibleCount).map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>

              {/* Load More Button */}
              {visibleCount < filteredNotes.length && (
                <div className="text-center pt-8">
                  <button
                    onClick={() => setVisibleCount(prev => prev + NOTES_PER_PAGE)}
                    className="px-6 py-2.5 bg-white border border-secondary-300 hover:bg-secondary-50 rounded-xl text-sm font-semibold text-secondary-800 shadow-sm transition-colors"
                  >
                    Load More Notes ({filteredNotes.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="No notes match your criteria"
              description="Try adjusting your search terms or clearing branch and semester filters."
              actionLabel="Clear Filters"
              onAction={handleResetFilters}
            />
          )}
        </main>
      </div>
    </div>
  )
}

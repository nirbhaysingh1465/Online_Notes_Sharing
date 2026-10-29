/**
 * Student Dashboard Page — ShareNotes
 * 
 * Features:
 * - Demonstration student profile: Raj Patel
 * - College: Ambalika Institute of Technology and Management, Lucknow
 * - Welcome message: "Welcome back, Raj!"
 * - Demonstration statistics:
 *     Total Notes Uploaded: 12
 *     Total Downloads: 248
 *     Saved Notes: 6
 *     Favorite Subjects: Data Structures, Mathematics, Engineering Physics, Computer Organization
 * - Clearly identified as demo statistics with banner
 * - Prominent "Upload Notes" CTA button
 * - Recent activity stream
 * - Uploaded notes tab & Saved notes tab with Edit/Delete capabilities
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Download,
  Bookmark,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Calendar,
  GraduationCap,
  Sparkles,
  School,
  Clock,
  BookOpen,
  Info,
  CheckCircle2
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { DEMO_STUDENT_PROFILE } from '../data/mockData'
import NoteCard from '../components/notes/NoteCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import EmptyState from '../components/common/EmptyState'
import { formatDate, formatFileSize, getInitials } from '../utils/helpers'

export default function DashboardPage() {
  const { user, profile } = useAuth()

  // Use Raj Patel's profile by default if not logged in or in demo mode
  const currentStudent = profile || DEMO_STUDENT_PROFILE

  const [activeTab, setActiveTab] = useState('uploads') // 'uploads' | 'favorites' | 'activity'
  const [myNotes, setMyNotes] = useState([])
  const [myFavorites, setMyFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  // Edit note modal state
  const [editingNote, setEditingNote] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editTopic, setEditTopic] = useState('')

  // Demonstration Recent Activity List
  const recentActivities = [
    {
      id: 'act-1',
      action: 'Note Downloaded',
      details: 'Stack and Queue Notes was downloaded by 14 students today',
      time: '2 hours ago',
      icon: Download,
      color: 'text-success-600 bg-success-50'
    },
    {
      id: 'act-2',
      action: '5-Star Rating Received',
      details: 'Ananya Sen rated "Programming in C — Important Programs" 5 stars',
      time: 'Yesterday',
      icon: Sparkles,
      color: 'text-warning-600 bg-warning-50'
    },
    {
      id: 'act-3',
      action: 'New Note Published',
      details: 'Uploaded "Computer Organization — Basic Concepts"',
      time: '3 days ago',
      icon: FileText,
      color: 'text-primary-600 bg-primary-50'
    },
    {
      id: 'act-4',
      action: 'Note Bookmarked',
      details: 'Added "Wave Optics" by Ananya Sen to saved notes',
      time: '5 days ago',
      icon: Bookmark,
      color: 'text-blue-600 bg-blue-50'
    }
  ]

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true)
      try {
        // Fetch notes uploaded by Raj Patel (or current user)
        const uploaderId = user?.id || DEMO_STUDENT_PROFILE.id
        const { data: notesData, error: notesError } = await supabase
          .from('notes')
          .select('*')
          .eq('uploader_id', uploaderId)
          .order('created_at', { ascending: false })

        if (notesError) throw notesError

        const notesWithStats = (notesData || []).map(n => ({
          ...n,
          profiles: {
            display_name: currentStudent.display_name,
            college_name: currentStudent.college_name
          }
        }))
        setMyNotes(notesWithStats)

        // Fetch saved notes (favorites)
        const { data: favData } = await supabase
          .from('favorites')
          .select('note_id')
          .eq('user_id', uploaderId)

        if (favData && favData.length > 0) {
          const noteIds = favData.map(f => f.note_id)
          const { data: favNotes } = await supabase
            .from('notes')
            .select(`
              *,
              profiles:uploader_id (display_name, college_name)
            `)
            .in('id', noteIds)

          setMyFavorites(favNotes || [])
        } else {
          // Fallback to sample notes for demo display
          const { data: allNotes } = await supabase.from('notes').select('*').limit(2)
          setMyFavorites(allNotes || [])
        }
      } catch (err) {
        console.error('Error loading dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user, profile])

  // Open edit modal
  function handleOpenEdit(note) {
    setEditingNote(note)
    setEditTitle(note.title)
    setEditDesc(note.description || '')
    setEditTopic(note.topic || '')
  }

  // Save edited note metadata
  async function handleSaveEdit(e) {
    e.preventDefault()
    if (!editingNote) return

    try {
      const { error } = await supabase
        .from('notes')
        .update({
          title: editTitle.trim(),
          description: editDesc.trim() || null,
          topic: editTopic.trim() || null,
        })
        .eq('id', editingNote.id)

      if (error) throw error

      setMyNotes(prev =>
        prev.map(n => n.id === editingNote.id
          ? { ...n, title: editTitle.trim(), description: editDesc.trim(), topic: editTopic.trim() }
          : n
        )
      )

      setEditingNote(null)
      toast.success('Note details updated successfully')
    } catch (err) {
      toast.error('Failed to update note')
    }
  }

  // Delete note
  async function handleDeleteNote(note) {
    if (!window.confirm(`Are you sure you want to delete "${note.title}"?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', note.id)

      if (error) throw error

      setMyNotes(prev => prev.filter(n => n.id !== note.id))
      toast.success('Note removed from your uploads')
    } catch (err) {
      toast.error('Failed to delete note')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Demonstration Data Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <span className="font-bold">Student Demonstration Showcase:</span> Displaying the student profile for{' '}
          <b>{DEMO_STUDENT_PROFILE.display_name}</b>, enrolled at{' '}
          <b>{DEMO_STUDENT_PROFILE.college_name}</b>. All statistics and notes below represent fictional demonstration data prepared for college project evaluation.
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-secondary-900 via-secondary-800 to-primary-950 rounded-3xl p-6 sm:p-8 text-white shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary-400 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            Student Workspace • {DEMO_STUDENT_PROFILE.academic_year}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, Raj!
          </h1>
          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-secondary-300">
            <span className="flex items-center gap-1.5">
              <School className="w-4 h-4 text-primary-400" />
              {DEMO_STUDENT_PROFILE.college_name}
            </span>
            <span>•</span>
            <span className="font-semibold text-white">
              {DEMO_STUDENT_PROFILE.branch} (Sem {DEMO_STUDENT_PROFILE.semester})
            </span>
          </div>
          <p className="text-xs text-secondary-400 max-w-xl italic">
            "{DEMO_STUDENT_PROFILE.bio}"
          </p>
        </div>

        {/* Prominent Upload Notes CTA */}
        <Link
          to="/upload"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-2xl shadow-lg transition-all hover:shadow-xl self-start md:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          Upload New Notes
        </Link>
      </div>

      {/* 4 Demonstration Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Uploaded */}
        <div className="bg-white p-5 rounded-2xl border border-secondary-200 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-extrabold text-secondary-900">
                {DEMO_STUDENT_PROFILE.stats.total_uploads}
              </p>
              <span className="text-[10px] bg-secondary-100 text-secondary-600 font-semibold px-1.5 py-0.5 rounded">
                Demo
              </span>
            </div>
            <p className="text-xs text-secondary-500 font-medium">Total Notes Uploaded</p>
          </div>
        </div>

        {/* Total Downloads */}
        <div className="bg-white p-5 rounded-2xl border border-secondary-200 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-success-50 text-success-600 flex items-center justify-center shrink-0">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-extrabold text-secondary-900">
                {DEMO_STUDENT_PROFILE.stats.total_downloads}
              </p>
              <span className="text-[10px] bg-secondary-100 text-secondary-600 font-semibold px-1.5 py-0.5 rounded">
                Demo
              </span>
            </div>
            <p className="text-xs text-secondary-500 font-medium">Total Downloads</p>
          </div>
        </div>

        {/* Saved Notes */}
        <div className="bg-white p-5 rounded-2xl border border-secondary-200 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-warning-50 text-warning-600 flex items-center justify-center shrink-0">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-extrabold text-secondary-900">
                {DEMO_STUDENT_PROFILE.stats.saved_notes}
              </p>
              <span className="text-[10px] bg-secondary-100 text-secondary-600 font-semibold px-1.5 py-0.5 rounded">
                Demo
              </span>
            </div>
            <p className="text-xs text-secondary-500 font-medium">Saved / Bookmarked</p>
          </div>
        </div>

        {/* Academic Role */}
        <div className="bg-white p-5 rounded-2xl border border-secondary-200 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-base font-extrabold text-secondary-900">3rd Semester</p>
            <p className="text-xs text-secondary-500 font-medium">CSE Department</p>
          </div>
        </div>
      </div>

      {/* Favorite Subjects Box */}
      <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-secondary-600 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary-600" />
            Favorite Subjects
          </h2>
          <span className="text-[11px] text-secondary-400">Curriculum Priorities</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {DEMO_STUDENT_PROFILE.stats.favorite_subjects.map((sub) => (
            <Link
              key={sub}
              to={`/explore?subject=${encodeURIComponent(sub)}`}
              className="px-3.5 py-2 bg-secondary-50 hover:bg-primary-50 text-secondary-800 hover:text-primary-700 rounded-xl text-xs font-semibold border border-secondary-200 transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-success-600" />
              {sub}
            </Link>
          ))}
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="space-y-6">
        <div className="flex border-b border-secondary-200">
          <button
            onClick={() => setActiveTab('uploads')}
            className={`py-3 px-6 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'uploads'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            My Uploaded Notes ({myNotes.length})
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`py-3 px-6 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'favorites'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-800'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Saved Notes ({myFavorites.length})
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`py-3 px-6 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'activity'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            Recent Activity
          </button>
        </div>

        {/* Tab 1: Uploaded Notes */}
        {loading ? (
          <LoadingSpinner message="Loading dashboard records..." />
        ) : activeTab === 'uploads' ? (
          myNotes.length > 0 ? (
            <div className="bg-white rounded-2xl border border-secondary-200 shadow-card overflow-hidden">
              <div className="divide-y divide-secondary-100">
                {myNotes.map((note) => (
                  <div key={note.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary-50/50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 bg-primary-50 text-primary-700 text-[11px] font-bold rounded">
                          Sem {note.semester} • {note.branch}
                        </span>
                        <span className="text-xs font-semibold text-secondary-700">
                          {note.subject}
                        </span>
                        {note.file_name && (
                          <span className="text-[11px] text-secondary-500 bg-secondary-100 px-2 py-0.5 rounded font-mono">
                            {note.file_name}
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/notes/${note.id}`}
                        className="text-base font-bold text-secondary-900 hover:text-primary-600 line-clamp-1"
                      >
                        {note.title}
                      </Link>
                      <p className="text-xs text-secondary-500">
                        Uploaded on {formatDate(note.created_at)} • {formatFileSize(note.file_size)} • {note.download_count} downloads
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        to={`/notes/${note.id}`}
                        className="px-3 py-1.5 text-xs font-semibold text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex items-center gap-1 border border-primary-200"
                        title="View & Preview"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Preview
                      </Link>
                      <button
                        onClick={() => handleOpenEdit(note)}
                        className="p-2 text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors"
                        title="Edit metadata"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note)}
                        className="p-2 text-danger-500 hover:text-danger-700 hover:bg-danger-50 rounded-lg transition-colors"
                        title="Delete note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title="No notes uploaded yet"
              description="Upload your lecture notes, lab solutions, and formula sheets to share with peers."
              actionLabel="Upload Notes"
              actionLink="/upload"
            />
          )
        ) : activeTab === 'favorites' ? (
          /* Tab 2: Saved Notes */
          myFavorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myFavorites.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Bookmark}
              title="No saved notes"
              description="Save essential study materials to access them rapidly during examination revisions."
              actionLabel="Browse Available Notes"
              actionLink="/explore"
            />
          )
        ) : (
          /* Tab 3: Recent Activity */
          <div className="bg-white rounded-2xl border border-secondary-200 shadow-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-secondary-900 pb-2 border-b border-secondary-200">
              Student Activity Timeline
            </h3>
            <div className="space-y-4">
              {recentActivities.map((act) => {
                const Icon = act.icon
                return (
                  <div key={act.id} className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-secondary-50/70 transition-colors">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${act.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-secondary-900">{act.action}</p>
                        <span className="text-[10px] text-secondary-400 font-medium">{act.time}</span>
                      </div>
                      <p className="text-xs text-secondary-600 mt-0.5">{act.details}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Edit Note Modal */}
      {editingNote && (
        <div className="fixed inset-0 z-50 bg-secondary-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-secondary-200 space-y-4 animate-scale-in">
            <h3 className="text-base font-bold text-secondary-900">Edit Note Metadata</h3>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-secondary-700 mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2.5 bg-secondary-50 border border-secondary-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary-700 mb-1">
                  Topic / Chapter
                </label>
                <input
                  type="text"
                  value={editTopic}
                  onChange={(e) => setEditTopic(e.target.value)}
                  className="w-full p-2.5 bg-secondary-50 border border-secondary-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full p-2.5 bg-secondary-50 border border-secondary-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingNote(null)}
                  className="px-4 py-2 text-xs font-semibold text-secondary-600 hover:bg-secondary-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

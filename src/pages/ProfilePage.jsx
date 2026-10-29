/**
 * Student Profile Page — ShareNotes
 * 
 * Displays:
 * - Raj Patel's demonstration student profile
 * - College: Ambalika Institute of Technology and Management, Lucknow
 * - Branch: Computer Science and Engineering (CSE)
 * - Semester: 3rd Semester
 * - Academic Year: 2026–2027
 * - Bio: B.Tech CSE student who shares notes and learning resources with fellow students.
 * - Uploaded notes list & Saved notes list
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  User,
  School,
  GraduationCap,
  Calendar,
  Mail,
  FileText,
  Bookmark,
  CheckCircle2,
  ExternalLink,
  BookOpen
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { DEMO_STUDENT_PROFILE } from '../data/mockData'
import { BRANCHES, SEMESTERS } from '../utils/constants'
import { getInitials, formatDate, formatFileSize } from '../utils/helpers'

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth()

  // Base profile details on Raj Patel demo student
  const activeStudent = profile || DEMO_STUDENT_PROFILE

  const [displayName, setDisplayName] = useState(activeStudent.display_name || 'Raj Patel')
  const [collegeName, setCollegeName] = useState(activeStudent.college_name || 'Ambalika Institute of Technology and Management, Lucknow')
  const [branch, setBranch] = useState(activeStudent.branch || 'CSE')
  const [semester, setSemester] = useState(activeStudent.semester || 3)
  const [bio, setBio] = useState(activeStudent.bio || 'B.Tech CSE student who shares notes and learning resources with fellow students.')
  const [isSaving, setIsSaving] = useState(false)

  const [uploadedNotes, setUploadedNotes] = useState([])
  const [savedNotes, setSavedNotes] = useState([])
  const [activeTab, setActiveTab] = useState('uploads')

  useEffect(() => {
    async function loadStudentData() {
      try {
        const uploaderId = user?.id || DEMO_STUDENT_PROFILE.id
        const { data: uploads } = await supabase
          .from('notes')
          .select('*')
          .eq('uploader_id', uploaderId)

        setUploadedNotes(uploads || [])

        const { data: allNotes } = await supabase.from('notes').select('*').limit(2)
        setSavedNotes(allNotes || [])
      } catch (err) {
        console.error('Error loading student notes:', err)
      }
    }

    loadStudentData()
  }, [user])

  async function handleSaveProfile(e) {
    e.preventDefault()
    setIsSaving(true)
    try {
      const updates = {
        id: user?.id || DEMO_STUDENT_PROFILE.id,
        display_name: displayName.trim(),
        college_name: collegeName.trim(),
        branch,
        semester: Number(semester),
        bio: bio.trim(),
        updated_at: new Date().toISOString()
      }

      await supabase.from('profiles').update(updates).eq('id', updates.id)
      if (refreshProfile) await refreshProfile()
      toast.success('Student profile updated successfully!')
    } catch (err) {
      toast.error('Could not save profile changes')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight">
          Student Profile
        </h1>
        <p className="text-secondary-600 text-xs mt-1">
          Demonstration profile for Raj Patel • Ambalika Institute of Technology and Management, Lucknow
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-card text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary-700 to-blue-500 text-white flex items-center justify-center text-3xl font-extrabold mx-auto shadow-md">
              {getInitials(displayName)}
            </div>

            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-primary-50 text-primary-700 text-[10px] font-bold rounded-full mb-1">
                Student
              </div>
              <h2 className="text-xl font-bold text-secondary-900">{displayName}</h2>
              <p className="text-xs text-secondary-500 mt-1 font-medium leading-relaxed">
                {collegeName}
              </p>
            </div>

            <p className="text-xs text-secondary-600 italic bg-secondary-50 p-3 rounded-xl border border-secondary-100">
              "{bio}"
            </p>

            <div className="pt-3 border-t border-secondary-100 grid grid-cols-2 gap-2 text-center">
              <div className="p-2 bg-secondary-50 rounded-xl">
                <p className="text-base font-extrabold text-primary-600">
                  {uploadedNotes.length || 12}
                </p>
                <p className="text-[10px] text-secondary-500 uppercase font-bold">Uploaded Notes</p>
              </div>
              <div className="p-2 bg-secondary-50 rounded-xl">
                <p className="text-base font-extrabold text-secondary-900">Sem {semester}</p>
                <p className="text-[10px] text-secondary-500 uppercase font-bold">{branch}</p>
              </div>
            </div>
          </div>

          {/* Academic Info Details */}
          <div className="bg-white p-5 rounded-2xl border border-secondary-200 shadow-card space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-secondary-500">
              Academic Details
            </h3>
            <div className="space-y-2 text-xs text-secondary-600">
              <div className="flex items-center gap-2">
                <School className="w-4 h-4 text-primary-600 shrink-0" />
                <span className="truncate">Ambalika ITM, Lucknow</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary-600 shrink-0" />
                <span>B.Tech CSE (3rd Semester)</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary-600 shrink-0" />
                <span>Academic Year 2026–2027</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-secondary-400 shrink-0" />
                <span>raj.patel@sharenotes.edu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile & Contributions Tabs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
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
              Uploaded Notes ({uploadedNotes.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`py-3 px-6 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'saved'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-800'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              Saved Notes ({savedNotes.length})
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`py-3 px-6 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'edit'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-800'
              }`}
            >
              <User className="w-4 h-4" />
              Edit Profile
            </button>
          </div>

          {/* Content Area */}
          {activeTab === 'uploads' ? (
            <div className="bg-white rounded-2xl border border-secondary-200 shadow-card divide-y divide-secondary-100 overflow-hidden">
              {uploadedNotes.map((note) => (
                <div key={note.id} className="p-4 flex items-center justify-between gap-4 hover:bg-secondary-50/50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] bg-primary-50 text-primary-700 font-bold px-2 py-0.5 rounded">
                        Sem {note.semester} • {note.branch}
                      </span>
                      <span className="text-xs font-semibold text-secondary-700">
                        {note.subject}
                      </span>
                    </div>
                    <Link
                      to={`/notes/${note.id}`}
                      className="text-sm font-bold text-secondary-900 hover:text-primary-600 line-clamp-1"
                    >
                      {note.title}
                    </Link>
                    <p className="text-[11px] text-secondary-500 mt-0.5">
                      File: {note.file_name} • {formatFileSize(note.file_size)} • {note.download_count} downloads
                    </p>
                  </div>
                  <Link
                    to={`/notes/${note.id}`}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg shrink-0"
                    title="View note"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          ) : activeTab === 'saved' ? (
            <div className="bg-white rounded-2xl border border-secondary-200 shadow-card divide-y divide-secondary-100 overflow-hidden">
              {savedNotes.map((note) => (
                <div key={note.id} className="p-4 flex items-center justify-between gap-4 hover:bg-secondary-50/50 transition-colors">
                  <div>
                    <span className="text-[10px] bg-secondary-100 text-secondary-700 font-bold px-2 py-0.5 rounded mr-2">
                      Sem {note.semester} • {note.branch}
                    </span>
                    <Link
                      to={`/notes/${note.id}`}
                      className="text-sm font-bold text-secondary-900 hover:text-primary-600"
                    >
                      {note.title}
                    </Link>
                    <p className="text-[11px] text-secondary-500 mt-0.5">
                      By {note.profiles?.display_name || 'Classmate'}
                    </p>
                  </div>
                  <Link
                    to={`/notes/${note.id}`}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            /* Edit Profile Form */
            <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-card space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full p-2.5 bg-secondary-50 border border-secondary-300 rounded-xl text-xs text-secondary-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
                  College / Institution Name
                </label>
                <input
                  type="text"
                  required
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full p-2.5 bg-secondary-50 border border-secondary-300 rounded-xl text-xs text-secondary-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
                    Branch
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full p-2.5 bg-secondary-50 border border-secondary-300 rounded-xl text-xs text-secondary-900"
                  >
                    {BRANCHES.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
                    Semester
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full p-2.5 bg-secondary-50 border border-secondary-300 rounded-xl text-xs text-secondary-900"
                  >
                    {SEMESTERS.map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
                  Bio / Statement
                </label>
                <textarea
                  rows="3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2.5 bg-secondary-50 border border-secondary-300 rounded-xl text-xs text-secondary-900"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                >
                  {isSaving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

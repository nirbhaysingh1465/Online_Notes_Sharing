/**
 * Admin Dashboard Page
 * 
 * Provides:
 * - Platform analytics & moderation statistics
 * - Management of reported content submitted by students
 * - Moderation & deletion of inappropriate notes (safely removes file & DB entry)
 * - User list inspection
 * - Protected route (admin only)
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield,
  FileText,
  Users,
  AlertTriangle,
  Download,
  Trash2,
  CheckCircle,
  ExternalLink,
  Clock,
  Filter
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { formatDate, formatFileSize } from '../utils/helpers'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('reports') // 'reports' | 'notes' | 'users'
  const [stats, setStats] = useState({ notes: 0, users: 0, downloads: 0, reports: 0 })
  const [reports, setReports] = useState([])
  const [allNotes, setAllNotes] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch admin data
  useEffect(() => {
    async function loadAdminData() {
      setLoading(true)
      try {
        // 1. Fetch reports with note details and reporter
        const { data: repData } = await supabase
          .from('reports')
          .select(`
            *,
            notes:note_id (id, title, branch, semester, storage_path),
            profiles:reporter_id (display_name)
          `)
          .order('created_at', { ascending: false })

        setReports(repData || [])

        // 2. Fetch all notes
        const { data: notesData } = await supabase
          .from('notes')
          .select(`
            *,
            profiles:uploader_id (display_name)
          `)
          .order('created_at', { ascending: false })

        setAllNotes(notesData || [])

        // 3. Fetch all users
        const { data: usersData } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })

        setAllUsers(usersData || [])

        // 4. Download count
        const { count: dlCount } = await supabase
          .from('downloads')
          .select('*', { count: 'exact', head: true })

        setStats({
          notes: notesData?.length || 0,
          users: usersData?.length || 0,
          downloads: dlCount || 0,
          reports: (repData || []).filter(r => r.status === 'pending').length
        })
      } catch (err) {
        console.error('Error loading admin panel:', err)
        toast.error('Failed to load admin data')
      } finally {
        setLoading(false)
      }
    }

    loadAdminData()
  }, [])

  // Resolve or dismiss report
  async function handleUpdateReport(reportId, newStatus) {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ status: newStatus })
        .eq('id', reportId)

      if (error) throw error

      setReports(prev =>
        prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r)
      )
      toast.success(`Report marked as ${newStatus}`)
    } catch (err) {
      toast.error('Failed to update report status')
    }
  }

  // Admin delete note (removes storage file and note record)
  async function handleDeleteNoteAsAdmin(note) {
    if (!window.confirm(`Admin Action: Permanently delete note "${note.title}"?`)) {
      return
    }

    try {
      if (note.storage_path) {
        await supabase.storage.from('notes-files').remove([note.storage_path])
      }

      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', note.id)

      if (error) throw error

      setAllNotes(prev => prev.filter(n => n.id !== note.id))
      // Update reports related to this note
      setReports(prev => prev.filter(r => r.note_id !== note.id))
      toast.success('Inappropriate content removed by Administrator')
    } catch (err) {
      toast.error('Failed to delete note')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-secondary-200">
        <div>
          <div className="flex items-center gap-2 text-danger-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            Moderator Control Panel
          </div>
          <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight">
            Admin Dashboard
          </h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-secondary-200 shadow-card">
          <div className="flex items-center justify-between text-secondary-500 mb-2">
            <span className="text-xs font-semibold">Total Notes</span>
            <FileText className="w-5 h-5 text-primary-600" />
          </div>
          <p className="text-2xl font-bold text-secondary-900">{stats.notes}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-secondary-200 shadow-card">
          <div className="flex items-center justify-between text-secondary-500 mb-2">
            <span className="text-xs font-semibold">Active Students</span>
            <Users className="w-5 h-5 text-success-600" />
          </div>
          <p className="text-2xl font-bold text-secondary-900">{stats.users}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-secondary-200 shadow-card">
          <div className="flex items-center justify-between text-secondary-500 mb-2">
            <span className="text-xs font-semibold">Total Downloads</span>
            <Download className="w-5 h-5 text-warning-600" />
          </div>
          <p className="text-2xl font-bold text-secondary-900">{stats.downloads}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-secondary-200 shadow-card">
          <div className="flex items-center justify-between text-secondary-500 mb-2">
            <span className="text-xs font-semibold">Pending Reports</span>
            <AlertTriangle className="w-5 h-5 text-danger-600" />
          </div>
          <p className="text-2xl font-bold text-danger-600">{stats.reports}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-secondary-200 mb-6">
        <button
          onClick={() => setActiveTab('reports')}
          className={`py-3 px-6 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'border-danger-600 text-danger-600'
              : 'border-transparent text-secondary-500 hover:text-secondary-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Reported Content ({reports.length})
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`py-3 px-6 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'notes'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-secondary-500 hover:text-secondary-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          All Notes ({allNotes.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`py-3 px-6 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-secondary-500 hover:text-secondary-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Registered Students ({allUsers.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Loading moderation data..." />
      ) : activeTab === 'reports' ? (
        /* Reports Table */
        reports.length > 0 ? (
          <div className="bg-white rounded-2xl border border-secondary-200 shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary-50 border-b border-secondary-200 text-secondary-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Report Reason</th>
                    <th className="p-4">Reported Note</th>
                    <th className="p-4">Reporter</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  {reports.map((rep) => (
                    <tr key={rep.id} className="hover:bg-secondary-50/50">
                      <td className="p-4 font-semibold text-danger-700">
                        {rep.reason}
                        <span className="block text-[10px] text-secondary-400 font-normal mt-0.5">
                          {formatDate(rep.created_at)}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-secondary-900">
                        {rep.notes ? (
                          <Link
                            to={`/notes/${rep.notes.id}`}
                            className="text-primary-600 hover:underline flex items-center gap-1"
                          >
                            {rep.notes.title}
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        ) : (
                          <span className="text-secondary-400 italic">Note already removed</span>
                        )}
                      </td>
                      <td className="p-4 text-secondary-600">
                        {rep.profiles?.display_name || 'Student'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          rep.status === 'pending'
                            ? 'bg-warning-100 text-warning-800'
                            : 'bg-success-100 text-success-800'
                        }`}>
                          {rep.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {rep.status === 'pending' ? (
                          <button
                            onClick={() => handleUpdateReport(rep.id, 'resolved')}
                            className="px-2.5 py-1 bg-success-600 text-white rounded font-medium hover:bg-success-700"
                          >
                            Mark Resolved
                          </button>
                        ) : (
                          <span className="text-secondary-400 text-[11px]">Resolved</span>
                        )}
                        {rep.notes && (
                          <button
                            onClick={() => handleDeleteNoteAsAdmin(rep.notes)}
                            className="px-2.5 py-1 bg-danger-50 text-danger-600 hover:bg-danger-100 rounded font-medium"
                          >
                            Delete Note
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-secondary-200 shadow-card">
            <CheckCircle className="w-12 h-12 text-success-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-secondary-900">No Pending Reports</h3>
            <p className="text-xs text-secondary-500 mt-1">All content has been moderated and verified.</p>
          </div>
        )
      ) : activeTab === 'notes' ? (
        /* All Notes Table */
        <div className="bg-white rounded-2xl border border-secondary-200 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary-50 border-b border-secondary-200 text-secondary-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Branch / Sem</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Uploader</th>
                  <th className="p-4">Uploaded</th>
                  <th className="p-4 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {allNotes.map((note) => (
                  <tr key={note.id} className="hover:bg-secondary-50/50">
                    <td className="p-4 font-bold text-secondary-900">
                      <Link to={`/notes/${note.id}`} className="hover:text-primary-600">
                        {note.title}
                      </Link>
                    </td>
                    <td className="p-4 text-secondary-600">
                      {note.branch} • Sem {note.semester}
                    </td>
                    <td className="p-4 text-secondary-600">{note.subject}</td>
                    <td className="p-4 text-secondary-600">
                      {note.profiles?.display_name || 'Student'}
                    </td>
                    <td className="p-4 text-secondary-400">{formatDate(note.created_at)}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteNoteAsAdmin(note)}
                        className="p-1.5 text-danger-500 hover:text-danger-700 hover:bg-danger-50 rounded"
                        title="Remove note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* All Users Table */
        <div className="bg-white rounded-2xl border border-secondary-200 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary-50 border-b border-secondary-200 text-secondary-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Display Name</th>
                  <th className="p-4">College</th>
                  <th className="p-4">Branch</th>
                  <th className="p-4">Semester</th>
                  <th className="p-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {allUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-secondary-50/50">
                    <td className="p-4 font-bold text-secondary-900">{u.display_name}</td>
                    <td className="p-4 text-secondary-600">{u.college_name || '—'}</td>
                    <td className="p-4 text-secondary-600">{u.branch || '—'}</td>
                    <td className="p-4 text-secondary-600">{u.semester ? `Sem ${u.semester}` : '—'}</td>
                    <td className="p-4 text-secondary-400">{formatDate(u.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Home Page — ShareNotes
 * 
 * Features:
 * - Hero section: "Share Knowledge. Grow Together."
 * - Search bar leading directly to filtered notes
 * - Browse by semester cards
 * - Real-time statistics from database / demo data
 * - Recently uploaded notes grid (featuring Raj Patel's notes)
 * - How it works steps
 */

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  Upload,
  BookOpen,
  Users,
  FileText,
  Download,
  ArrowRight,
  Sparkles,
  GraduationCap,
  TrendingUp,
  Award
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import NoteCard from '../components/notes/NoteCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { SEMESTERS } from '../utils/constants'

export default function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [recentNotes, setRecentNotes] = useState([])
  const [stats, setStats] = useState({ notes: 6, users: 4, downloads: 447 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const { data: notes, error: notesError } = await supabase
          .from('notes')
          .select(`
            *,
            profiles:uploader_id (display_name, college_name)
          `)
          .order('created_at', { ascending: false })
          .limit(6)

        if (notesError) throw notesError

        const notesWithStats = await Promise.all(
          (notes || []).map(async (note) => {
            const { count: downloadCount } = await supabase
              .from('downloads')
              .select('*', { count: 'exact', head: true })
              .eq('note_id', note.id)

            const { data: ratingData } = await supabase
              .from('ratings')
              .select('rating')
              .eq('note_id', note.id)

            const avgRating = ratingData && ratingData.length > 0
              ? (ratingData.reduce((sum, r) => sum + r.rating, 0) / ratingData.length)
              : (note.avg_rating || null)

            return {
              ...note,
              download_count: (downloadCount || 0) + (note.download_count || 0),
              avg_rating: avgRating,
            }
          })
        )

        setRecentNotes(notesWithStats)

        // Platform stats
        const { count: totalNotes } = await supabase
          .from('notes')
          .select('*', { count: 'exact', head: true })

        const { count: totalUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })

        setStats({
          notes: totalNotes || 6,
          users: totalUsers || 4,
          downloads: notesWithStats.reduce((acc, n) => acc + (n.download_count || 0), 0) || 447,
        })
      } catch (error) {
        console.error('Error fetching home data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHomeData()
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="animate-fade-in">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-secondary-900 text-white">
        {/* Glow ambient background elements */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-blue-400 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-indigo-500 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Ambalika ITM, Lucknow • B.Tech CSE Project
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Share Knowledge.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-cyan-200 to-white">
                Grow Together.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto font-normal">
              A student-driven platform where engineering students upload, explore, and download syllabus-aligned lecture notes, formula sheets, and lab solutions.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes (e.g. Data Structures, Differential Equations)..."
                  className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white text-secondary-900 placeholder-secondary-400 shadow-xl border-0 focus:outline-none focus:ring-4 focus:ring-primary-300/40 text-sm"
                  id="hero-search"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                >
                  Search
                </button>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/explore"
                className="flex items-center gap-2 px-6 py-3.5 bg-white text-primary-700 text-xs font-bold rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <BookOpen className="w-4 h-4" />
                Browse All Notes
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-6 py-3.5 bg-white/10 backdrop-blur-md text-white text-xs font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200"
              >
                <GraduationCap className="w-4 h-4" />
                View Demo Dashboard (Raj Patel)
              </Link>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L720 20L1440 60V60H0V60Z" fill="#F8FAFC" />
          </svg>
        </div>
      </section>

      {/* ==================== PLATFORM STATISTICS ==================== */}
      <section className="py-10 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard icon={FileText} value={stats.notes} label="Verified Notes" color="primary" />
            <StatCard icon={Users} value={stats.users} label="Active Students" color="success" />
            <StatCard icon={Download} value={stats.downloads} label="Downloads Tracked" color="warning" />
          </div>
        </div>
      </section>

      {/* ==================== BROWSE BY SEMESTER ==================== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 text-[11px] font-bold rounded-full mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              B.Tech Curriculum
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-secondary-900 tracking-tight">
              Browse Notes by Semester
            </h2>
            <p className="text-secondary-500 text-xs max-w-md mx-auto mt-1">
              Find class notes categorized according to the university semester curriculum
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SEMESTERS.map((sem) => (
              <Link
                key={sem}
                to={`/explore?semester=${sem}`}
                className="group flex flex-col items-center gap-3 p-6 bg-secondary-50 hover:bg-primary-50/70 rounded-2xl border border-secondary-200 hover:border-primary-300 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-100 group-hover:bg-primary-200 flex items-center justify-center transition-colors">
                  <GraduationCap className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-secondary-900">Semester {sem}</p>
                  <p className="text-[11px] text-primary-600 group-hover:underline mt-0.5">Explore Notes →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURED & RECENT NOTES ==================== */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-100 text-primary-800 text-[11px] font-bold rounded-full mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                Curated Demo Notes
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-secondary-900 tracking-tight">
                Recently Shared Notes
              </h2>
              <p className="text-secondary-500 text-xs">
                Featuring verified notes shared by student Raj Patel and peers
              </p>
            </div>
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors self-start sm:self-auto"
            >
              View All 6 Notes
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner fullPage={false} message="Loading demonstration notes..." />
          ) : recentNotes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-secondary-900 tracking-tight mb-2">
              How ShareNotes Works
            </h2>
            <p className="text-secondary-500 text-xs max-w-md mx-auto">
              Empowering students through organized peer-to-peer academic resource sharing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-secondary-50 rounded-2xl border border-secondary-200">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                1
              </div>
              <h3 className="text-base font-bold text-secondary-900 mb-1">Upload Your Notes</h3>
              <p className="text-xs text-secondary-500 leading-relaxed">
                Upload your hand-written lecture PDFs with semester, branch, and subject tags.
              </p>
            </div>

            <div className="text-center p-6 bg-secondary-50 rounded-2xl border border-secondary-200">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                2
              </div>
              <h3 className="text-base font-bold text-secondary-900 mb-1">Search & Filter</h3>
              <p className="text-xs text-secondary-500 leading-relaxed">
                Filter by CSE semester or search specific topics like Stacks, Queues, or Optics.
              </p>
            </div>

            <div className="text-center p-6 bg-secondary-50 rounded-2xl border border-secondary-200">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                3
              </div>
              <h3 className="text-base font-bold text-secondary-900 mb-1">Download & Review</h3>
              <p className="text-xs text-secondary-500 leading-relaxed">
                Download verified materials, leave peer ratings, and save favorites before exams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== BOTTOM CTA ==================== */}
      <section className="py-16 bg-gradient-to-r from-primary-700 via-primary-600 to-secondary-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto border border-white/20">
            <TrendingUp className="w-6 h-6 text-blue-200" />
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            Ready to Share Your Notes?
          </h2>
          <p className="text-blue-100 text-sm max-w-xl mx-auto leading-relaxed">
            Join ShareNotes today and help your peers at Ambalika Institute of Technology and Management access quality study materials.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to={user ? '/upload' : '/login'}
              className="px-6 py-3 bg-white text-primary-700 text-xs font-bold rounded-xl hover:bg-blue-50 transition-all shadow-md"
            >
              Upload Notes Now
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-white/10 text-white border border-white/20 text-xs font-bold rounded-xl hover:bg-white/20 transition-all"
            >
              Explore Raj Patel's Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function StatCard({ icon: Icon, value, label, color }) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
  }

  return (
    <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-secondary-200 shadow-card">
      <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-secondary-900">{value}</p>
        <p className="text-xs text-secondary-500 font-semibold">{label}</p>
      </div>
    </div>
  )
}

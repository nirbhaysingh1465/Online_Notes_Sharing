/**
 * Note Details Page
 * 
 * Shows full note metadata:
 * - Title, description, subject, semester, branch, topic, academic year
 * - Uploader information and publish date
 * - Download button (records verified download in database)
 * - PDF document preview
 * - Favorite / Bookmark button
 * - Ratings & reviews section with 1-per-student limit
 * - Report content modal
 * - Related notes carousel/list
 */

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Download,
  Bookmark,
  Share2,
  Calendar,
  User,
  GraduationCap,
  BookOpen,
  FileText,
  AlertTriangle,
  ArrowLeft,
  Check,
  Star,
  Eye
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import StarRating from '../components/common/StarRating'
import LoadingSpinner from '../components/common/LoadingSpinner'
import NoteCard from '../components/notes/NoteCard'
import { formatDate, formatFileSize, getInitials } from '../utils/helpers'
import { REPORT_REASONS } from '../utils/constants'
import { getSamplePdfBlob } from '../data/mockData'

export default function NoteDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [note, setNote] = useState(null)
  const [relatedNotes, setRelatedNotes] = useState([])
  const [isFavorited, setIsFavorited] = useState(false)
  const [downloadCount, setDownloadCount] = useState(0)
  const [ratings, setRatings] = useState([])
  const [userRating, setUserRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [hasRated, setHasRated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Report modal state
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0])
  const [isSubmittingReport, setIsSubmittingReport] = useState(false)

  // Fetch note details, ratings, favorites, related notes
  useEffect(() => {
    async function fetchNoteData() {
      setLoading(true)
      try {
        // 1. Fetch note with uploader profile
        const { data: noteData, error: noteError } = await supabase
          .from('notes')
          .select(`
            *,
            profiles:uploader_id (display_name, college_name, branch, avatar_url)
          `)
          .eq('id', id)
          .single()

        if (noteError || !noteData) {
          throw new Error('Note not found')
        }

        setNote(noteData)

        // 2. Fetch download count
        const { count: dlCount } = await supabase
          .from('downloads')
          .select('*', { count: 'exact', head: true })
          .eq('note_id', id)
        setDownloadCount(dlCount || noteData.download_count || 0)

        // 3. Fetch ratings & reviews
        const { data: ratingData } = await supabase
          .from('ratings')
          .select(`
            *,
            profiles:user_id (display_name)
          `)
          .eq('note_id', id)
          .order('created_at', { ascending: false })

        const rList = ratingData || []
        setRatings(rList)

        // Check if current user already rated
        if (user) {
          const userExisting = rList.find(r => r.user_id === user.id)
          if (userExisting) {
            setHasRated(true)
            setUserRating(userExisting.rating)
            setReviewText(userExisting.review || '')
          } else {
            setHasRated(false)
            setUserRating(0)
            setReviewText('')
          }

          // Check if favorited
          const { data: favData } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', user.id)
            .eq('note_id', id)
            .single()

          setIsFavorited(Boolean(favData))
        }

        // 4. Fetch related notes (same semester or branch, excluding current note)
        const { data: related } = await supabase
          .from('notes')
          .select(`
            *,
            profiles:uploader_id (display_name)
          `)
          .eq('branch', noteData.branch)
          .neq('id', id)
          .limit(3)

        setRelatedNotes(related || [])
      } catch (err) {
        console.error('Error loading note:', err)
        toast.error('Could not load note details')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchNoteData()
    }
  }, [id, user])

  // Handle Download Action
  async function handleDownload() {
    try {
      // Record download in PostgreSQL / Supabase
      await supabase.from('downloads').insert({
        note_id: id,
        user_id: user?.id || null,
        created_at: new Date().toISOString()
      })

      setDownloadCount(prev => prev + 1)

      // Trigger actual demonstration PDF file download
      const blob = getSamplePdfBlob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const downloadFilename = note.file_name || `${note.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`
      a.download = downloadFilename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success(`Downloaded demo file: ${downloadFilename}`)
    } catch (err) {
      console.error('Download error:', err)
      toast.error('Failed to download file')
    }
  }

  // Handle Favorite toggle
  async function handleToggleFavorite() {
    if (!user) {
      toast.error('Please log in to save notes to your favorites')
      navigate('/login')
      return
    }

    try {
      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('note_id', id)

        setIsFavorited(false)
        toast.success('Removed from favorites')
      } else {
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            note_id: id,
            created_at: new Date().toISOString()
          })

        setIsFavorited(true)
        toast.success('Saved to your favorites!')
      }
    } catch (err) {
      toast.error('Could not update favorites')
    }
  }

  // Handle submitting a rating/review
  async function handleRatingSubmit(e) {
    e.preventDefault()
    if (!user) {
      toast.error('Please sign in to rate this note')
      navigate('/login')
      return
    }

    if (userRating === 0) {
      toast.error('Please select a star rating')
      return
    }

    try {
      const newRating = {
        user_id: user.id,
        note_id: id,
        rating: userRating,
        review: reviewText.trim() || null,
        created_at: new Date().toISOString()
      }

      await supabase.from('ratings').insert(newRating)

      setHasRated(true)
      setRatings(prev => [
        {
          ...newRating,
          profiles: { display_name: user.user_metadata?.display_name || 'You' }
        },
        ...prev
      ])

      toast.success('Thank you for your rating!')
    } catch (err) {
      toast.error('Failed to submit rating')
    }
  }

  // Handle submitting a report
  async function handleReportSubmit(e) {
    e.preventDefault()
    if (!user) {
      toast.error('Please log in to submit a report')
      navigate('/login')
      return
    }

    setIsSubmittingReport(true)
    try {
      await supabase.from('reports').insert({
        reporter_id: user.id,
        note_id: id,
        reason: reportReason,
        status: 'pending',
        created_at: new Date().toISOString()
      })

      setShowReportModal(false)
      toast.success('Report submitted to ShareNotes administrators for review.')
    } catch (err) {
      toast.error('Failed to submit report')
    } finally {
      setIsSubmittingReport(false)
    }
  }

  // Copy share link
  function handleShare() {
    navigator.clipboard?.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  if (loading) {
    return <LoadingSpinner fullPage message="Fetching note details..." />
  }

  if (!note) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-secondary-900 mb-2">Note Not Found</h2>
        <p className="text-sm text-secondary-500 mb-6">This note may have been removed or does not exist.</p>
        <Link to="/explore" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium">
          Browse Available Notes
        </Link>
      </div>
    )
  }

  // Calculate average rating
  const avgRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : (note.avg_rating || null)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary-600 hover:text-secondary-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Notes Explorer
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Left Content: Title, metadata, PDF preview, Reviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-secondary-200 shadow-card">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-md flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                Semester {note.semester}
              </span>
              <span className="px-3 py-1 bg-secondary-100 text-secondary-700 text-xs font-semibold rounded-md">
                {note.branch}
              </span>
              <span className="px-3 py-1 bg-secondary-100 text-secondary-700 text-xs font-semibold rounded-md flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-primary-600" />
                {note.file_type?.toUpperCase() || 'PDF'}
              </span>
              {note.academic_year && (
                <span className="px-3 py-1 bg-secondary-50 text-secondary-600 text-xs font-medium rounded-md">
                  Year: {note.academic_year}
                </span>
              )}
            </div>

            {/* Note Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary-900 tracking-tight mb-3">
              {note.title}
            </h1>

            {/* Subject & Topic */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-600 mb-6">
              <span className="font-semibold text-primary-600 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                {note.subject}
              </span>
              {note.topic && (
                <span className="text-secondary-500">
                  Topic: <b className="text-secondary-800">{note.topic}</b>
                </span>
              )}
            </div>

            {/* Description */}
            <div className="bg-secondary-50 p-4 rounded-xl text-sm text-secondary-700 leading-relaxed mb-6">
              {note.description || 'No detailed description provided by the uploader.'}
            </div>

            {/* Uploader info & Date row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-secondary-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
                  {getInitials(note.profiles?.display_name || 'Student')}
                </div>
                <div>
                  <p className="text-sm font-bold text-secondary-900">
                    {note.profiles?.display_name || 'Anonymous Student'}
                  </p>
                  <p className="text-xs text-secondary-500">
                    {note.profiles?.college_name || 'Engineering Student'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-secondary-500">
                <Calendar className="w-4 h-4 text-secondary-400" />
                Uploaded {formatDate(note.created_at)}
              </div>
            </div>
          </div>

          {/* PDF Viewer / Document Preview Box */}
          <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-secondary-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary-600" />
                Document Preview
              </h2>
              <span className="text-xs text-secondary-500">
                Size: {formatFileSize(note.file_size)}
              </span>
            </div>

            {/* Preview Frame */}
            <div className="w-full h-80 bg-secondary-900 rounded-xl overflow-hidden flex flex-col items-center justify-center text-white p-6 text-center space-y-3 relative">
              <FileText className="w-16 h-16 text-primary-400" />
              <div>
                <p className="text-sm font-semibold">{note.title}.pdf</p>
                <p className="text-xs text-secondary-400 mt-1">Verified academic document in standard PDF format</p>
              </div>
              <button
                onClick={handleDownload}
                className="mt-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg shadow transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF to View Full Document
              </button>
            </div>
          </div>

          {/* Ratings & Reviews Section */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-secondary-200 shadow-card space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-secondary-200">
              <div>
                <h3 className="text-lg font-bold text-secondary-900">Student Reviews & Ratings</h3>
                <p className="text-xs text-secondary-500">
                  {ratings.length} {ratings.length === 1 ? 'review' : 'reviews'} from classmates
                </p>
              </div>
              {avgRating && (
                <div className="flex items-center gap-1.5 bg-warning-50 px-3 py-1.5 rounded-xl border border-warning-200">
                  <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                  <span className="text-sm font-bold text-warning-700">{avgRating} / 5</span>
                </div>
              )}
            </div>

            {/* Leave a Rating Form */}
            {!hasRated ? (
              <form onSubmit={handleRatingSubmit} className="bg-secondary-50 p-5 rounded-xl space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-700">
                  Rate this study note
                </h4>
                <div>
                  <StarRating rating={userRating} onRate={setUserRating} size="lg" />
                </div>
                <textarea
                  rows="2"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Optional review: Did this help you prepare for your exam?"
                  className="w-full p-3 bg-white border border-secondary-300 rounded-lg text-xs text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Submit Rating
                </button>
              </form>
            ) : (
              <div className="bg-success-50 p-4 rounded-xl text-xs text-success-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-success-600" />
                You have already rated this note ({userRating} Stars). Thank you!
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4 pt-2">
              {ratings.map((r) => (
                <div key={r.id} className="p-4 bg-secondary-50/50 rounded-xl border border-secondary-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-secondary-900">
                      {r.profiles?.display_name || 'Verified Student'}
                    </span>
                    <StarRating rating={r.rating} readOnly size="sm" />
                  </div>
                  {r.review && (
                    <p className="text-xs text-secondary-600 leading-relaxed">
                      "{r.review}"
                    </p>
                  )}
                  <span className="text-[10px] text-secondary-400 block">
                    {formatDate(r.created_at)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Action Buttons, Quick Stats, Related Notes */}
        <div className="space-y-6">
          {/* Main Action Box */}
          <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-card space-y-4 sticky top-24">
            <h3 className="text-sm font-bold uppercase tracking-wider text-secondary-500">
              Take Action
            </h3>

            {/* Download CTA */}
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl shadow-md transition-all hover:shadow-lg"
            >
              <Download className="w-5 h-5" />
              Download Notes ({downloadCount})
            </button>

            {/* Favorite CTA */}
            <button
              onClick={handleToggleFavorite}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold border transition-colors ${
                isFavorited
                  ? 'bg-warning-50 border-warning-300 text-warning-700'
                  : 'bg-white border-secondary-300 text-secondary-700 hover:bg-secondary-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isFavorited ? 'fill-warning-500 text-warning-500' : ''}`} />
              {isFavorited ? 'Saved in Favorites' : 'Add to Favorites'}
            </button>

            {/* Share Link */}
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-medium text-secondary-600 hover:bg-secondary-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share Link with Classmates
            </button>

            {/* Report Button */}
            <div className="pt-3 border-t border-secondary-200 text-center">
              <button
                onClick={() => setShowReportModal(true)}
                className="text-xs text-danger-600 hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Report Inappropriate Content
              </button>
            </div>
          </div>

          {/* Related Notes */}
          {relatedNotes.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-card space-y-4">
              <h3 className="text-sm font-bold text-secondary-900">
                Related Notes ({note.branch})
              </h3>
              <div className="space-y-4">
                {relatedNotes.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/notes/${rel.id}`}
                    className="block p-3 rounded-xl border border-secondary-100 hover:border-primary-200 hover:bg-primary-50/50 transition-colors"
                  >
                    <p className="text-xs font-bold text-secondary-900 line-clamp-1">
                      {rel.title}
                    </p>
                    <p className="text-[11px] text-primary-600 mt-0.5">
                      {rel.subject} • Sem {rel.semester}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-secondary-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-secondary-200 space-y-4 animate-scale-in">
            <div className="flex items-center gap-2 text-danger-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-secondary-900">Report Note</h3>
            </div>
            <p className="text-xs text-secondary-600">
              Help us keep ShareNotes academic content trustworthy and safe. Please select why you are reporting this document:
            </p>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2.5 bg-secondary-50 border border-secondary-300 rounded-lg text-xs text-secondary-900 focus:outline-none focus:ring-2 focus:ring-danger-500"
                >
                  {REPORT_REASONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-xs font-medium text-secondary-600 hover:bg-secondary-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReport}
                  className="px-4 py-2 text-xs font-bold bg-danger-600 hover:bg-danger-700 text-white rounded-lg transition-colors"
                >
                  {isSubmittingReport ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

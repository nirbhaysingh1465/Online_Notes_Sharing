/**
 * NoteCard Component — ShareNotes
 * 
 * Displays a note card with:
 * - Branch, Semester, Subject, Topic
 * - PDF file name badge
 * - Uploader name (Raj Patel / peers)
 * - Ratings & Download count
 * - View & Preview CTA
 */

import { Link } from 'react-router-dom'
import {
  FileText,
  Download,
  Star,
  Calendar,
  User,
  BookOpen,
  GraduationCap,
  Eye
} from 'lucide-react'
import { formatDate, formatFileSize, truncateText } from '../../utils/helpers'

export default function NoteCard({ note }) {
  const avgRating = note.avg_rating ? parseFloat(note.avg_rating).toFixed(1) : null
  const downloadCount = note.download_count || 0

  return (
    <div className="group bg-white rounded-2xl border border-secondary-200 hover:border-primary-400 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Top Accent Strip */}
        <div className="h-1.5 bg-gradient-to-r from-primary-600 via-blue-500 to-indigo-600 opacity-80 group-hover:opacity-100 transition-opacity" />

        <div className="p-5">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-primary-50 text-primary-700 text-[11px] font-bold rounded-md">
              <GraduationCap className="w-3 h-3" />
              Sem {note.semester}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 bg-secondary-100 text-secondary-700 text-[11px] font-bold rounded-md">
              {note.branch}
            </span>
            {note.file_name && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary-50 text-secondary-600 border border-secondary-200 text-[10px] font-mono rounded-md max-w-[150px] truncate">
                <FileText className="w-2.5 h-2.5 text-primary-600" />
                {note.file_name}
              </span>
            )}
          </div>

          {/* Title */}
          <Link to={`/notes/${note.id}`}>
            <h3 className="text-sm sm:text-base font-bold text-secondary-900 group-hover:text-primary-600 transition-colors mb-1.5 line-clamp-2">
              {note.title}
            </h3>
          </Link>

          {/* Subject & Topic */}
          <p className="text-xs text-primary-600 font-semibold mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            {note.subject}
          </p>

          {/* Description */}
          {note.description && (
            <p className="text-xs text-secondary-500 mb-4 line-clamp-2 leading-relaxed">
              {truncateText(note.description, 110)}
            </p>
          )}
        </div>
      </div>

      {/* Footer Row */}
      <div className="px-5 pb-5 pt-3 border-t border-secondary-100">
        <div className="flex items-center justify-between text-xs text-secondary-500 mb-3">
          {/* Uploader Name */}
          <span className="flex items-center gap-1 font-medium text-secondary-700">
            <User className="w-3.5 h-3.5 text-primary-600" />
            {note.profiles?.display_name || 'Raj Patel'}
          </span>

          {/* Stats: Rating & Downloads */}
          <div className="flex items-center gap-3">
            {avgRating && (
              <span className="flex items-center gap-0.5 text-warning-600 font-bold">
                <Star className="w-3 h-3 fill-warning-500" />
                {avgRating}
              </span>
            )}
            <span className="flex items-center gap-1 text-secondary-600 font-semibold">
              <Download className="w-3 h-3 text-secondary-400" />
              {downloadCount}
            </span>
          </div>
        </div>

        {/* Action Buttons: Preview & View */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/notes/${note.id}`}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-secondary-50 hover:bg-secondary-100 text-secondary-700 text-xs font-bold rounded-xl border border-secondary-200 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-primary-600" />
            Preview
          </Link>
          <Link
            to={`/notes/${note.id}`}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </Link>
        </div>
      </div>
    </div>
  )
}

/**
 * 404 Not Found Page
 */

import { Link } from 'react-router-dom'
import { FileQuestion, Home, Search } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
      <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center text-primary-600 mb-6">
        <FileQuestion className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-extrabold text-secondary-900 tracking-tight mb-2">
        404 — Page Not Found
      </h1>
      <p className="text-sm text-secondary-500 max-w-md mb-8">
        The academic material or page you are looking for does not exist or may have been moved.
      </p>
      <div className="flex gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
        >
          <Home className="w-4 h-4" />
          Go to Home
        </Link>
        <Link
          to="/explore"
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-secondary-300 hover:bg-secondary-50 text-secondary-800 text-xs font-semibold rounded-xl shadow-sm transition-colors"
        >
          <Search className="w-4 h-4" />
          Browse Notes
        </Link>
      </div>
    </div>
  )
}

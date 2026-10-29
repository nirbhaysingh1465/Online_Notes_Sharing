/**
 * EmptyState Component
 * 
 * Shown when there's no data to display (e.g., no notes found).
 * Provides a friendly message and an optional action button.
 */

import { Link } from 'react-router-dom'
import { FileX } from 'lucide-react'

export default function EmptyState({
  icon: Icon = FileX,
  title = 'Nothing here yet',
  description = 'No items to display.',
  actionLabel,
  actionLink,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-secondary-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-secondary-400" />
      </div>
      <h3 className="text-lg font-semibold text-secondary-800 mb-2">{title}</h3>
      <p className="text-sm text-secondary-500 max-w-sm mb-6">{description}</p>
      {actionLabel && actionLink && (
        <Link
          to={actionLink}
          className="px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionLink && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

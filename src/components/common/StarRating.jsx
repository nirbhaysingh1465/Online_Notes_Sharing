/**
 * StarRating Component
 * 
 * Displays a row of clickable star icons for rating a note.
 * Can be interactive (for submitting ratings) or read-only (for display).
 */

import { useState } from 'react'
import { Star } from 'lucide-react'

export default function StarRating({
  rating = 0,
  onRate,
  readOnly = false,
  size = 'md',
}) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverRating || rating)
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onRate && onRate(star)}
            onMouseEnter={() => !readOnly && setHoverRating(star)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            <Star
              className={`${sizeClasses[size]} transition-colors ${
                isFilled
                  ? 'text-warning-500 fill-warning-500'
                  : 'text-secondary-300'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}

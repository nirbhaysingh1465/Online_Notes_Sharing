/**
 * LoadingSpinner Component
 * 
 * A simple animated spinner shown while data is loading.
 * Can be used as a full-page loader or inline spinner.
 */

export default function LoadingSpinner({ size = 'md', fullPage = false, message = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${sizeClasses[size]} border-secondary-200 border-t-primary-600 rounded-full animate-spin`}
      />
      {message && <p className="text-sm text-secondary-500">{message}</p>}
    </div>
  )

  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {spinner}
      </div>
    )
  }

  return spinner
}

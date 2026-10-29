/**
 * Utility Helper Functions
 * 
 * Small, reusable functions used across the app.
 */

/**
 * Format a file size from bytes to a human-readable string.
 * Example: 1048576 → "1.0 MB"
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

/**
 * Format a date to a friendly string.
 * Example: "2026-10-29T..." → "Oct 29, 2026"
 */
export function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format a date to a relative time string.
 * Example: "2 hours ago", "3 days ago"
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  return formatDate(dateString)
}

/**
 * Generate a unique filename for storage.
 * Example: "a1b2c3d4_my-notes.pdf"
 */
export function generateStorageFilename(originalName) {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const sanitized = originalName
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '-')
    .replace(/-+/g, '-')
  return `${timestamp}_${random}_${sanitized}`
}

/**
 * Truncate text to a maximum length with ellipsis.
 * Example: truncateText("Hello World", 8) → "Hello..."
 */
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Sanitize user input to prevent XSS (Cross-Site Scripting).
 * Removes HTML tags from user-provided text.
 */
export function sanitizeText(text) {
  if (!text) return ''
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

/**
 * Validate an email address format.
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Get initials from a display name (for avatar placeholder).
 * Example: "John Doe" → "JD"
 */
export function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

/**
 * Debounce a function call (wait before executing).
 * Useful for search input — don't search on every keystroke.
 */
export function debounce(func, delay = 300) {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

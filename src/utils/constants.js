/**
 * Constants
 * 
 * Centralized constants used throughout ShareNotes.
 */

// Academic branches available in the platform
export const BRANCHES = [
  'CSE',    // Computer Science & Engineering
  'ECE',    // Electronics & Communication
  'EEE',    // Electrical & Electronics
  'ME',     // Mechanical Engineering
  'CE',     // Civil Engineering
  'IT',     // Information Technology
  'AIML',   // AI & Machine Learning
  'DS',     // Data Science
]

// Semesters (1 to 8 for B.Tech)
export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8]

// Common subjects organized by semester (for CSE)
export const SUGGESTED_SUBJECTS = {
  1: ['Mathematics', 'Engineering Physics', 'Programming in C', 'Engineering Chemistry', 'Basic Electrical Engineering', 'English'],
  2: ['Mathematics', 'Engineering Physics', 'Programming in C', 'Engineering Graphics', 'Environmental Science'],
  3: ['Data Structures', 'Mathematics', 'Database Management Systems', 'Computer Organization', 'Digital Logic Design', 'Discrete Mathematics'],
  4: ['Operating Systems', 'Database Management Systems', 'Computer Organization', 'Theory of Computation', 'Computer Networks'],
  5: ['Compiler Design', 'Computer Graphics', 'Machine Learning', 'Web Technologies', 'Software Engineering'],
  6: ['Artificial Intelligence', 'Cloud Computing', 'Data Analytics', 'IoT', 'Information Security'],
  7: ['Deep Learning', 'Blockchain Architecture', 'Cyber Security', 'Major Project'],
  8: ['Major Project', 'Industry Internship'],
}

// Maximum file size for uploads (in bytes) — default 10 MB
export const MAX_FILE_SIZE = parseInt(
  import.meta.env.VITE_MAX_FILE_SIZE || '10485760'
)

// Allowed file types
export const ALLOWED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
}

// File type labels for display
export const FILE_TYPE_LABELS = {
  'application/pdf': 'PDF',
}

// Sorting options for the notes explorer
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Recently Uploaded' },
  { value: 'most_downloaded', label: 'Most Downloaded' },
  { value: 'highest_rated', label: 'Highest Rated' },
  { value: 'oldest', label: 'Oldest First' },
]

// Report reasons
export const REPORT_REASONS = [
  'Inappropriate content',
  'Copyright violation',
  'Spam or misleading',
  'Wrong subject/semester',
  'Low quality or unreadable',
  'Other',
]

// Number of notes per page
export const NOTES_PER_PAGE = 12

// Academic years for dropdown
export const ACADEMIC_YEARS = (() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear; i >= currentYear - 5; i--) {
    years.push(`${i}–${i + 1}`)
  }
  return years
})()

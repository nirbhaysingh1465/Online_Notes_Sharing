/**
 * Upload Notes Page
 * 
 * Allows authenticated students to upload academic PDF notes.
 * - Enforces PDF file type only
 * - Enforces 10MB file size limit
 * - Validates title, branch, semester, subject, topic, and academic year
 * - Shows upload progress bar
 * - Handles orphaned storage clean-up if database save fails
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  BookOpen,
  Info
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import {
  BRANCHES,
  SEMESTERS,
  SUGGESTED_SUBJECTS,
  MAX_FILE_SIZE,
  ACADEMIC_YEARS
} from '../utils/constants'
import { formatFileSize, generateStorageFilename } from '../utils/helpers'

export default function UploadPage() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [branch, setBranch] = useState(profile?.branch || 'CSE')
  const [semester, setSemester] = useState(profile?.semester || 1)
  const [subject, setSubject] = useState('')
  const [topic, setTopic] = useState('')
  const [academicYear, setAcademicYear] = useState(ACADEMIC_YEARS[0])
  const [file, setFile] = useState(null)

  // Upload UI state
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)

  // Subject suggestions for current semester
  const suggestedSubjects = SUGGESTED_SUBJECTS[semester] || []

  // File drag & drop handlers
  function handleDrag(e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0])
    }
  }

  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0])
    }
  }

  function handleFileSelected(selectedFile) {
    // 1. Validate file extension and MIME type
    const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf')
    if (!isPdf) {
      toast.error('Only PDF documents are accepted at this time.')
      return
    }

    // 2. Validate maximum file size (10 MB)
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error(`File size exceeds ${formatFileSize(MAX_FILE_SIZE)} limit.`)
      return
    }

    setFile(selectedFile)
  }

  // Submit Handler
  async function handleSubmit(e) {
    if (!file) {
      toast.error('Please select a PDF file to upload')
      return
    }

    if (!title.trim() || !subject.trim()) {
      toast.error('Please enter a note title and subject')
      return
    }

    const activeUserId = user?.id || 'raj-patel-demo'

    setIsUploading(true)
    setUploadProgress(20)

    let uploadedStoragePath = null

    try {
      // Step 1: Generate unique storage path
      const storagePath = `notes/${activeUserId}/${generateStorageFilename(file.name)}`
      uploadedStoragePath = storagePath

      setUploadProgress(50)

      // Step 2: Upload PDF file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('notes-files')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw new Error(uploadError.message || 'File upload failed')
      }

      setUploadProgress(80)

      // Step 3: Insert metadata record into PostgreSQL / Demo Store
      const { data: noteRecord, error: dbError } = await supabase
        .from('notes')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          branch,
          semester: parseInt(semester, 10),
          subject: subject.trim(),
          topic: topic.trim() || null,
          academic_year: academicYear,
          storage_path: storagePath,
          file_name: file.name,
          file_type: 'pdf',
          file_size: file.size,
          uploader_id: activeUserId,
          download_count: 0,
          avg_rating: 5.0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (dbError) {
        // Step 4: Handle failure safely without leaving orphaned files
        if (uploadedStoragePath) {
          console.warn('Metadata save failed. Cleaning up orphaned file in storage...')
          await supabase.storage.from('notes-files').remove([uploadedStoragePath])
        }
        throw new Error(dbError.message || 'Failed to save note details')
      }

      setUploadProgress(100)
      toast.success('Notes uploaded successfully!')
      navigate('/dashboard')
    } catch (err) {
      console.error('Upload process error:', err)
      toast.error(err.message || 'An error occurred during upload')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight mb-2">
          Share Your Notes
        </h1>
        <p className="text-secondary-600 text-sm">
          Upload and share your high-quality lecture notes, exam formula sheets, or lab guides with fellow students.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-secondary-200 shadow-card">
        {/* Section 1: File Upload Box */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-2">
            PDF Document *
          </label>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              dragActive
                ? 'border-primary-500 bg-primary-50/50'
                : 'border-secondary-300 hover:border-primary-400 bg-secondary-50/50'
            }`}
          >
            {file ? (
              /* Selected File Card */
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-secondary-200 max-w-md mx-auto shadow-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="text-left truncate">
                    <p className="text-xs font-bold text-secondary-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-[11px] text-secondary-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-1 text-secondary-400 hover:text-danger-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              /* Dropzone Placeholder */
              <div className="space-y-3">
                <UploadCloud className="w-12 h-12 text-primary-500 mx-auto" />
                <div>
                  <p className="text-sm font-semibold text-secondary-800">
                    Drag and drop your PDF here, or{' '}
                    <label className="text-primary-600 hover:underline cursor-pointer">
                      browse computer
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </p>
                  <p className="text-xs text-secondary-400 mt-1">
                    Accepts PDF files only up to {formatFileSize(MAX_FILE_SIZE)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Note Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
              Note Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Data Structures Complete Hand-written Notes"
              className="w-full p-3 bg-secondary-50 border border-secondary-300 rounded-xl text-sm text-secondary-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Branch */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
              Branch / Department *
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full p-3 bg-secondary-50 border border-secondary-300 rounded-xl text-sm text-secondary-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {BRANCHES.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
              Semester *
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
              className="w-full p-3 bg-secondary-50 border border-secondary-300 rounded-xl text-sm text-secondary-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {SEMESTERS.map(s => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
              Subject Name *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Operating Systems"
              className="w-full p-3 bg-secondary-50 border border-secondary-300 rounded-xl text-sm text-secondary-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {suggestedSubjects.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-[11px] text-secondary-400 mr-1">Suggestions:</span>
                {suggestedSubjects.slice(0, 3).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSubject(s)}
                    className="text-[11px] bg-secondary-100 hover:bg-secondary-200 px-2 py-0.5 rounded text-secondary-700"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Topic / Unit */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
              Topic / Unit (Optional)
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Unit 3 - Deadlocks and CPU Scheduling"
              className="w-full p-3 bg-secondary-50 border border-secondary-300 rounded-xl text-sm text-secondary-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Academic Year */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
              Academic Year
            </label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full p-3 bg-secondary-50 border border-secondary-300 rounded-xl text-sm text-secondary-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {ACADEMIC_YEARS.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key highlights or mentions (e.g. contains solved previous year exam problems, diagrams, etc.)..."
              className="w-full p-3 bg-secondary-50 border border-secondary-300 rounded-xl text-sm text-secondary-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Progress Bar (during upload) */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-secondary-600">
              <span>Uploading & validating note...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-secondary-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-secondary-200">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 text-xs font-semibold text-secondary-600 hover:bg-secondary-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading || !file}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition-all hover:shadow"
          >
            {isUploading ? 'Uploading...' : 'Publish Notes'}
          </button>
        </div>
      </form>
    </div>
  )
}

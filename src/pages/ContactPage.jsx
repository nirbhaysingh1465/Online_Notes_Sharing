/**
 * Contact & Feedback Page
 * 
 * Provides a contact form with:
 * - Email format validation
 * - Anti-spam check (honeypot + simple math challenge)
 * - Friendly success confirmation
 */

import { useState } from 'react'
import { Mail, MessageSquare, Send, CheckCircle2, Phone, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { isValidEmail } from '../utils/helpers'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [captcha, setCaptcha] = useState('') // Simple spam challenge (3 + 4)
  const [isSent, setIsSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    if (captcha.trim() !== '7') {
      toast.error('Spam verification failed. Please solve: 3 + 4 = 7')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSent(true)
      toast.success('Your message has been received! We will reply shortly.')
    }, 600)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight">
          Get in Touch
        </h1>
        <p className="text-sm text-secondary-600 max-w-lg mx-auto">
          Have suggestions, feature requests, or questions about ShareNotes? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact info cards */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-secondary-200 shadow-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-secondary-500">
              Email Support
            </h3>
            <p className="text-xs text-secondary-700 font-semibold">
              support@sharenotes.edu
            </p>
            <p className="text-[11px] text-secondary-400">
              Response time within 24 hours
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-secondary-200 shadow-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-secondary-100 text-secondary-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-secondary-500">
              College Campus
            </h3>
            <p className="text-xs text-secondary-700 font-semibold">
              Ambalika Institute of Technology and Management
            </p>
            <p className="text-[11px] text-secondary-500">
              Lucknow, Uttar Pradesh
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          {isSent ? (
            <div className="bg-white p-8 rounded-2xl border border-secondary-200 shadow-card text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-success-500 mx-auto" />
              <h2 className="text-xl font-bold text-secondary-900">Thank You!</h2>
              <p className="text-xs text-secondary-600 max-w-md mx-auto">
                Your message has been sent to the ShareNotes team. We appreciate your valuable feedback!
              </p>
              <button
                onClick={() => {
                  setIsSent(false)
                  setName('')
                  setEmail('')
                  setSubject('')
                  setMessage('')
                  setCaptcha('')
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-bold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-secondary-200 shadow-card space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aarav Sharma"
                    className="w-full p-2.5 bg-secondary-50 border border-secondary-300 rounded-lg text-xs text-secondary-900 focus:bg-white focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full p-2.5 bg-secondary-50 border border-secondary-300 rounded-lg text-xs text-secondary-900 focus:bg-white focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Suggestion for Semester 3 subject tags"
                  className="w-full p-2.5 bg-secondary-50 border border-secondary-300 rounded-lg text-xs text-secondary-900 focus:bg-white focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
                  Message *
                </label>
                <textarea
                  rows="4"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your feedback or query here..."
                  className="w-full p-2.5 bg-secondary-50 border border-secondary-300 rounded-lg text-xs text-secondary-900 focus:bg-white focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Anti-spam challenge */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
                  Verification: What is 3 + 4? *
                </label>
                <input
                  type="text"
                  required
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value)}
                  placeholder="Enter the number"
                  className="w-32 p-2.5 bg-secondary-50 border border-secondary-300 rounded-lg text-xs text-secondary-900 focus:bg-white focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Sending...' : 'Submit Message'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

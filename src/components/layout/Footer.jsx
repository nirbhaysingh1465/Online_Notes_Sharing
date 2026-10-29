/**
 * Footer Component — ShareNotes
 * 
 * Features:
 * - Brand logo & tagline: "Share Knowledge. Grow Together."
 * - Academic links, resources, and contact
 * - College project acknowledgement
 */

import { Link } from 'react-router-dom'
import { BookOpen, Heart, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary-900 text-secondary-300 mt-auto border-t border-secondary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold tracking-tight">
                Share<span className="text-primary-400">Notes</span>
              </span>
            </Link>
            <p className="text-xs text-primary-300 font-semibold tracking-wide">
              Share Knowledge. Grow Together.
            </p>
            <p className="text-xs text-secondary-400 leading-relaxed">
              A peer-to-peer academic platform for college engineering students to discover, share, and review verified course notes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Explore & Study
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">
                  All Engineering Notes
                </Link>
              </li>
              <li>
                <Link to="/explore?semester=3" className="hover:text-white transition-colors">
                  3rd Semester (CSE)
                </Link>
              </li>
              <li>
                <Link to="/explore?semester=1" className="hover:text-white transition-colors">
                  1st Semester Notes
                </Link>
              </li>
              <li>
                <Link to="/upload" className="hover:text-white transition-colors">
                  Upload Notes
                </Link>
              </li>
            </ul>
          </div>

          {/* Project & Institution */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Academic Institution
            </h3>
            <p className="text-xs text-secondary-300 font-medium">
              Ambalika Institute of Technology and Management
            </p>
            <p className="text-xs text-secondary-400 mt-1 flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary-400 shrink-0 mt-0.5" />
              Lucknow, Uttar Pradesh
            </p>
            <p className="text-[11px] text-secondary-500 mt-2">
              B.Tech Computer Science & Engineering Mini Project
            </p>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Contact & Code
            </h3>
            <div className="space-y-2 text-xs">
              <a
                href="mailto:contact@sharenotes.edu"
                className="flex items-center gap-2 hover:text-white transition-colors text-secondary-400"
              >
                <Mail className="w-4 h-4 text-primary-400" />
                contact@sharenotes.edu
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors text-secondary-400"
              >
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub Repository
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-secondary-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-secondary-500">
          <p>© {currentYear} ShareNotes. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-danger-500 fill-danger-500" /> for Ambalika ITM Students
          </p>
        </div>
      </div>
    </footer>
  )
}

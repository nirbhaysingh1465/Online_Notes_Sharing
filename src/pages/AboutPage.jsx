/**
 * About Page — ShareNotes
 * 
 * Explains ShareNotes mission, architecture, academic benefits,
 * and Terms of Use for students.
 */

import { BookOpen, Users, Shield, GraduationCap, Award, Sparkles, School } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in space-y-12">
      {/* Hero section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          About ShareNotes
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-secondary-900 tracking-tight">
          Share Knowledge. Grow Together.
        </h1>
        <p className="text-base text-secondary-600 max-w-2xl mx-auto leading-relaxed">
          ShareNotes is a peer-to-peer academic notes sharing platform developed by B.Tech CSE students of Ambalika Institute of Technology and Management, Lucknow, designed to make finding, sharing, and organizing verified study materials effortless.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-secondary-900">Branch & Semester Focused</h3>
          <p className="text-xs text-secondary-600 leading-relaxed">
            Notes are organized according to university B.Tech syllabi (CSE, ECE, EEE, etc.), making exam preparation fast, direct, and targeted.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-success-50 text-success-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-secondary-900">Community Reviewed</h3>
          <p className="text-xs text-secondary-600 leading-relaxed">
            Student ratings and reviews help you find the highest quality notes with diagrams, derivations, and solved university questions.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-secondary-100 text-secondary-700 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-secondary-900">Secure & Transparent</h3>
          <p className="text-xs text-secondary-600 leading-relaxed">
            Built with modern web standards, PostgreSQL Row Level Security (RLS), and student content moderation to safeguard academic integrity.
          </p>
        </div>
      </div>

      {/* Academic College Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-primary-800 font-bold text-sm">
            <School className="w-4 h-4 text-primary-600" />
            Ambalika Institute of Technology and Management, Lucknow
          </div>
          <p className="text-xs text-blue-900">
            Department of Computer Science & Engineering • Academic Project Initiative
          </p>
        </div>
        <div className="text-xs bg-white text-primary-700 font-bold px-3 py-1.5 rounded-xl border border-blue-200 shadow-sm shrink-0">
          Student Showcase: Raj Patel
        </div>
      </div>

      {/* Terms of Use */}
      <div id="terms" className="bg-white p-6 sm:p-8 rounded-2xl border border-secondary-200 shadow-card space-y-4">
        <h2 className="text-xl font-bold text-secondary-900">Platform Guidelines & Terms of Use</h2>
        <ul className="space-y-3 text-xs text-secondary-600 leading-relaxed list-disc list-inside">
          <li>
            <b>Original Academic Content:</b> Please only upload notes that you have written, prepared, or have authorization to share.
          </li>
          <li>
            <b>Respect Copyright:</b> Do not upload copyrighted textbooks or commercial materials without explicit license.
          </li>
          <li>
            <b>Constructive Reviews:</b> Keep ratings and reviews polite, constructive, and aimed at helping classmates learn better.
          </li>
          <li>
            <b>Academic Integrity:</b> ShareNotes is intended for study support and collaborative peer learning. Do not upload live exam answers or cheat sheets.
          </li>
        </ul>
      </div>
    </div>
  )
}

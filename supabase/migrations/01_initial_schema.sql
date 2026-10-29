-- ====================================================================
-- ShareNotes - Online Notes Sharing Platform
-- Complete PostgreSQL Database Schema & Security Policies for Supabase
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- 2. TABLES DEFINITIONS
-- ====================================================================

-- 2.1 PROFILES TABLE
-- Extends Supabase auth.users with student-specific academic information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  college_name TEXT,
  branch TEXT NOT NULL DEFAULT 'CSE',
  semester INTEGER NOT NULL DEFAULT 1 CHECK (semester BETWEEN 1 AND 8),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 2.2 USER ROLES TABLE
-- Stores administrative permissions (Admin vs Student)
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin'))
);

-- 2.3 NOTES TABLE
-- Stores academic metadata for every uploaded PDF study material
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  branch TEXT NOT NULL,
  semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
  subject TEXT NOT NULL,
  topic TEXT,
  academic_year TEXT,
  storage_path TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'pdf',
  file_size BIGINT NOT NULL,
  uploader_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.4 FAVORITES TABLE
-- Allows students to bookmark notes. Unique constraint prevents duplicate favorites.
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_user_note_favorite UNIQUE (user_id, note_id)
);

-- 2.5 RATINGS & REVIEWS TABLE
-- Stores 1-5 star ratings and reviews. Unique constraint prevents duplicate ratings per student.
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_user_note_rating UNIQUE (user_id, note_id)
);

-- 2.6 DOWNLOADS TABLE
-- Tracks verified file downloads
CREATE TABLE IF NOT EXISTS public.downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.7 REPORTS TABLE
-- Allows students to report inappropriate or infringing study materials
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- 3. INDEXES FOR PERFORMANCE
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_notes_branch ON public.notes(branch);
CREATE INDEX IF NOT EXISTS idx_notes_semester ON public.notes(semester);
CREATE INDEX IF NOT EXISTS idx_notes_subject ON public.notes(subject);
CREATE INDEX IF NOT EXISTS idx_notes_uploader ON public.notes(uploader_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_note ON public.ratings(note_id);
CREATE INDEX IF NOT EXISTS idx_downloads_note ON public.downloads(note_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);

-- ====================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4.1 PROFILES POLICIES
-- Anyone can view profiles (needed to display uploader name)
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can only insert/update their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 4.2 USER ROLES POLICIES
-- Users can read their own role; Admins can read all roles
CREATE POLICY "Users can view their own role"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- 4.3 NOTES POLICIES
-- Anyone can view published notes
CREATE POLICY "Notes are viewable by everyone"
  ON public.notes FOR SELECT
  USING (true);

-- Only authenticated users can upload notes
CREATE POLICY "Authenticated users can insert notes"
  ON public.notes FOR INSERT
  WITH CHECK (auth.uid() = uploader_id);

-- Students can only update their own notes
CREATE POLICY "Users can update their own notes"
  ON public.notes FOR UPDATE
  USING (auth.uid() = uploader_id);

-- Students can delete their own notes; Admins can delete any note
CREATE POLICY "Users or Admins can delete notes"
  ON public.notes FOR DELETE
  USING (auth.uid() = uploader_id OR public.is_admin());

-- 4.4 FAVORITES POLICIES
CREATE POLICY "Users can view their own favorites"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

-- 4.5 RATINGS POLICIES
CREATE POLICY "Ratings are viewable by everyone"
  ON public.ratings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can submit a rating"
  ON public.ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rating"
  ON public.ratings FOR UPDATE
  USING (auth.uid() = user_id);

-- 4.6 DOWNLOADS POLICIES
CREATE POLICY "Anyone can record a download"
  ON public.downloads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Downloads count is viewable by everyone"
  ON public.downloads FOR SELECT
  USING (true);

-- 4.7 REPORTS POLICIES
-- Authenticated users can submit a report
CREATE POLICY "Authenticated users can submit reports"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- Only admins can view and update reports
CREATE POLICY "Admins can view all reports"
  ON public.reports FOR SELECT
  USING (public.is_admin() OR auth.uid() = reporter_id);

CREATE POLICY "Admins can update report status"
  ON public.reports FOR UPDATE
  USING (public.is_admin());

-- ====================================================================
-- 5. AUTOMATIC PROFILE CREATION TRIGGER
-- When a student signs up via Supabase Auth, automatically creates profile
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, college_name, branch, semester)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    'Engineering College',
    'CSE',
    1
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop if exists and recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- 6. STORAGE BUCKET CONFIGURATION
-- Note: Run in Supabase SQL editor to create the storage bucket
-- ====================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('notes-files', 'notes-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies:
-- Anyone can view/download public PDFs
CREATE POLICY "Public PDFs are accessible to everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'notes-files');

-- Authenticated users can upload to notes/ folder
CREATE POLICY "Authenticated students can upload notes"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'notes-files'
    AND auth.role() = 'authenticated'
  );

-- Users can delete their own files or Admin can delete
CREATE POLICY "Users can delete their own storage files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'notes-files'
    AND (
      auth.uid()::text = (storage.foldername(name))[2]
      OR public.is_admin()
    )
  );

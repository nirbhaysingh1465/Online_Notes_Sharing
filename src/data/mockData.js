/**
 * ShareNotes — Demonstration Data
 * 
 * Contains demonstration records for academic evaluation:
 * - Student Profile: Raj Patel (Ambalika Institute of Technology and Management, Lucknow)
 * - 6 Curated CSE Demo Notes (Semesters 1 & 3)
 * - Fictional Dashboard Statistics
 */

// Generate a valid minimal PDF blob so demonstration downloads produce an actual valid document
const SAMPLE_PDF_BASE64 = 
  'JVBERi0xLjQKJcTl8uXrCjEgMCBvYmoKPDwgL1R5cGUgL0NhdGFsb2cgL1BhZ2VzIDIgMCBSID4+CmVuZG9iamoyIDAgb2JqCjw8IC9UeXBlIC9QYWdlcyAvS2lkcyBbMyAwIFJdIC9Db3VudCAxID4+CmVuZG9iamozIDAgb2JqCjw8IC9UeXBlIC9QYWdlIC9QYXJlbnQgMiAwIFIgL01lZGlhQm94IFswIDAgNjEyIDc5Ml0gL0NvbnRlbnRzIDQgMCBSID4+CmVuZG9iamo0IDAgb2JqCjw8IC9MZW5ndGggNTIgPj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgoxMDAgNzAwIFRECihtb3RlTmVzdCAtIFNhbXBsZSBBY2FkZW1pYyBOb3RlcykgVGoKRVQKZW5kc3RyZWFtCmVuZG9iamp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA2OCAwMDAwIG4gCjAwMDAwMDAxMjUgMDAwMDAgbiAKMDAwMDAwMDIyMSAwMDAwIG4gCnRyYWlsZXIKPDwgL1NpemUgNSA+PgpzdGFydHhyZWYKMzI0CiUlRU9G'

export function getSamplePdfBlob() {
  const byteCharacters = atob(SAMPLE_PDF_BASE64)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: 'application/pdf' })
}

/**
 * Fictional Demo Student Profile — Raj Patel
 */
export const DEMO_STUDENT_PROFILE = {
  id: 'raj-patel-demo',
  display_name: 'Raj Patel',
  role: 'Student',
  college_name: 'Ambalika Institute of Technology and Management, Lucknow',
  branch: 'Computer Science and Engineering (CSE)',
  semester: 3,
  academic_year: '2026–2027',
  bio: 'B.Tech CSE student who shares notes and learning resources with fellow students.',
  avatar_url: '',
  created_at: '2026-08-01T09:00:00Z',
  stats: {
    total_uploads: 12, // Fictional demonstration statistic
    total_downloads: 248, // Fictional demonstration statistic
    saved_notes: 6, // Fictional demonstration statistic
    favorite_subjects: [
      'Data Structures',
      'Mathematics',
      'Engineering Physics',
      'Computer Organization'
    ]
  }
}

export const INITIAL_PROFILES = [
  DEMO_STUDENT_PROFILE,
  {
    id: 'user-ananya',
    display_name: 'Ananya Sen',
    college_name: 'Ambalika Institute of Technology and Management, Lucknow',
    branch: 'Computer Science and Engineering (CSE)',
    semester: 1,
    avatar_url: '',
    created_at: '2026-08-15T10:00:00Z',
  },
  {
    id: 'user-rohan',
    display_name: 'Rohan Verma',
    college_name: 'Ambalika Institute of Technology and Management, Lucknow',
    branch: 'Computer Science and Engineering (CSE)',
    semester: 3,
    avatar_url: '',
    created_at: '2026-08-20T11:30:00Z',
  },
  {
    id: 'user-admin',
    display_name: 'Admin ShareNotes',
    college_name: 'Ambalika Institute of Technology and Management, Lucknow',
    branch: 'Computer Science and Engineering (CSE)',
    semester: 8,
    avatar_url: '',
    created_at: '2026-01-01T00:00:00Z',
  }
]

/**
 * Curated Fictional Demonstration Notes for B.Tech CSE
 */
export const INITIAL_NOTES = [
  {
    id: 'note-1',
    title: 'Data Structures — Stack and Queue Notes',
    description: 'Comprehensive hand-written notes covering Array and Linked List implementations of Stacks, Queues, Circular Queues, Infix to Postfix conversion, and solved university questions.',
    branch: 'CSE',
    semester: 3,
    subject: 'Data Structures',
    topic: 'Stacks, Queues & Evaluation of Expressions',
    academic_year: '2026–2027',
    storage_path: 'notes/stacks-and-queues-demo.pdf',
    file_name: 'stacks-and-queues-demo.pdf',
    file_type: 'pdf',
    file_size: 3670016, // 3.5 MB
    uploader_id: 'raj-patel-demo',
    download_count: 94,
    avg_rating: 4.9,
    rating_count: 24,
    created_at: '2026-09-12T10:15:00Z',
    updated_at: '2026-09-12T10:15:00Z',
    profiles: {
      display_name: 'Raj Patel',
      college_name: 'Ambalika Institute of Technology and Management, Lucknow',
      branch: 'Computer Science and Engineering (CSE)'
    }
  },
  {
    id: 'note-2',
    title: 'Mathematics — Differential Equations',
    description: 'Step-by-step solved derivations of Higher Order Linear Differential Equations with constant coefficients, Cauchy-Euler equations, and Method of Variation of Parameters.',
    branch: 'CSE',
    semester: 3,
    subject: 'Mathematics',
    topic: 'Differential Equations & Partial Derivatives',
    academic_year: '2026–2027',
    storage_path: 'notes/differential-equations-demo.pdf',
    file_name: 'differential-equations-demo.pdf',
    file_type: 'pdf',
    file_size: 4404019, // 4.2 MB
    uploader_id: 'raj-patel-demo',
    download_count: 67,
    avg_rating: 4.8,
    rating_count: 18,
    created_at: '2026-09-18T14:30:00Z',
    updated_at: '2026-09-18T14:30:00Z',
    profiles: {
      display_name: 'Raj Patel',
      college_name: 'Ambalika Institute of Technology and Management, Lucknow',
      branch: 'Computer Science and Engineering (CSE)'
    }
  },
  {
    id: 'note-3',
    title: 'Engineering Physics — Wave Optics',
    description: 'Concise formula sheet and theory notes on Huygens Principle, Interference of Light (Young double slit, Thin films), Diffraction (Fraunhofer single and double slit), and Polarization.',
    branch: 'CSE',
    semester: 1,
    subject: 'Engineering Physics',
    topic: 'Wave Optics & Lasers',
    academic_year: '2026–2027',
    storage_path: 'notes/wave-optics-demo.pdf',
    file_name: 'wave-optics-demo.pdf',
    file_type: 'pdf',
    file_size: 2621440, // 2.5 MB
    uploader_id: 'user-ananya',
    download_count: 82,
    avg_rating: 4.7,
    rating_count: 15,
    created_at: '2026-09-22T08:45:00Z',
    updated_at: '2026-09-22T08:45:00Z',
    profiles: {
      display_name: 'Ananya Sen',
      college_name: 'Ambalika Institute of Technology and Management, Lucknow',
      branch: 'Computer Science and Engineering (CSE)'
    }
  },
  {
    id: 'note-4',
    title: 'Programming in C — Important Programs',
    description: 'Curated 50+ essential C programs frequently asked in university practical lab exams: Pointers, Dynamic Memory (malloc/calloc), Recursion, String manipulation, and File I/O.',
    branch: 'CSE',
    semester: 1,
    subject: 'Programming in C',
    topic: 'Pointers, Arrays, Strings & File Handling',
    academic_year: '2026–2027',
    storage_path: 'notes/programming-in-c-demo.pdf',
    file_name: 'programming-in-c-demo.pdf',
    file_type: 'pdf',
    file_size: 3145728, // 3.0 MB
    uploader_id: 'raj-patel-demo',
    download_count: 112,
    avg_rating: 5.0,
    rating_count: 36,
    created_at: '2026-09-28T16:20:00Z',
    updated_at: '2026-09-28T16:20:00Z',
    profiles: {
      display_name: 'Raj Patel',
      college_name: 'Ambalika Institute of Technology and Management, Lucknow',
      branch: 'Computer Science and Engineering (CSE)'
    }
  },
  {
    id: 'note-5',
    title: 'Database Management Systems — SQL Fundamentals',
    description: 'Complete SQL reference with DDL, DML, DCL commands, complex subqueries, aggregate functions, GROUP BY, HAVING, and table normalization (1NF, 2NF, 3NF, BCNF).',
    branch: 'CSE',
    semester: 3,
    subject: 'Database Management Systems',
    topic: 'SQL Queries, Joins & Normalization',
    academic_year: '2026–2027',
    storage_path: 'notes/sql-fundamentals-demo.pdf',
    file_name: 'sql-fundamentals-demo.pdf',
    file_type: 'pdf',
    file_size: 3984588, // 3.8 MB
    uploader_id: 'user-rohan',
    download_count: 73,
    avg_rating: 4.8,
    rating_count: 21,
    created_at: '2026-10-05T11:00:00Z',
    updated_at: '2026-10-05T11:00:00Z',
    profiles: {
      display_name: 'Rohan Verma',
      college_name: 'Ambalika Institute of Technology and Management, Lucknow',
      branch: 'Computer Science and Engineering (CSE)'
    }
  },
  {
    id: 'note-6',
    title: 'Computer Organization — Basic Concepts',
    description: 'Clear architectural diagrams covering Von Neumann architecture, Instruction cycle, Addressing modes, Control Unit design (Hardwired & Microprogrammed), and Cache Memory mapping.',
    branch: 'CSE',
    semester: 3,
    subject: 'Computer Organization',
    topic: 'CPU Architecture, Addressing Modes & Cache Memory',
    academic_year: '2026–2027',
    storage_path: 'notes/computer-organization-demo.pdf',
    file_name: 'computer-organization-demo.pdf',
    file_type: 'pdf',
    file_size: 4718592, // 4.5 MB
    uploader_id: 'raj-patel-demo',
    download_count: 89,
    avg_rating: 4.9,
    rating_count: 28,
    created_at: '2026-10-14T09:10:00Z',
    updated_at: '2026-10-14T09:10:00Z',
    profiles: {
      display_name: 'Raj Patel',
      college_name: 'Ambalika Institute of Technology and Management, Lucknow',
      branch: 'Computer Science and Engineering (CSE)'
    }
  }
]

export const INITIAL_RATINGS = [
  {
    id: 'rating-1',
    user_id: 'user-ananya',
    note_id: 'note-1',
    rating: 5,
    review: 'Stack and queue conversion examples are crystal clear! Helped immensely in my 3rd semester exam prep.',
    created_at: '2026-09-15T12:00:00Z',
    profiles: { display_name: 'Ananya Sen' }
  },
  {
    id: 'rating-2',
    user_id: 'user-rohan',
    note_id: 'note-4',
    rating: 5,
    review: 'All C lab programs in one place with proper comments and output diagrams. Excellent work by Raj.',
    created_at: '2026-09-30T17:15:00Z',
    profiles: { display_name: 'Rohan Verma' }
  }
]

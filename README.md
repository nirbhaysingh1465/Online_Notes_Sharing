# 🎓 ShareNotes — Online Notes Sharing Platform

> **"Share Knowledge. Grow Together."**

A modern, responsive, and student-centered academic notes sharing web application developed as a B.Tech Computer Science & Engineering college project.

Built with **React 19**, **Vite**, **Tailwind CSS**, and **Supabase (PostgreSQL, Authentication & Object Storage)**.

---

## 📌 1. Project Abstract

In higher educational institutions such as **Ambalika Institute of Technology and Management, Lucknow**, engineering students frequently face challenges in accessing well-structured, syllabus-aligned study materials before semester examinations. Crucial lecture notes, lab manuals, and exam formulas are often lost in chat groups or remain accessible only to select study circles.

**ShareNotes** addresses this challenge by providing a centralized, peer-reviewed academic repository where engineering students can upload, search, view, download, rate, and bookmark verified study materials organized systematically by branch, semester, subject, and topic.

---

## 👨‍🎓 2. Demonstration Student Profile (Showcase)

For college evaluation and mini-project demonstration, a pre-configured student profile is included:

- **Name:** Raj Patel
- **Role:** Student
- **College:** Ambalika Institute of Technology and Management, Lucknow
- **Branch:** Computer Science and Engineering (CSE)
- **Semester:** 3rd Semester
- **Academic Year:** 2026–2027
- **Bio:** *"B.Tech CSE student who shares notes and learning resources with fellow students."*
- **Demonstration Statistics:**
  - **Total Notes Uploaded:** 12
  - **Total Downloads:** 248
  - **Saved Notes:** 6
  - **Favorite Subjects:** Data Structures, Mathematics, Engineering Physics, Computer Organization

> 💡 *Note: These demonstration details are stored locally and clearly identified in the interface as demo data until live database records are connected.*

---

## 📚 3. Curated Demonstration Notes (B.Tech CSE)

ShareNotes includes 6 curriculum-aligned sample records in the Notes Explorer:

| # | Note Title | Subject | Semester | Branch | Demonstration File | Uploader |
|---|---|---|---|---|---|---|
| 1 | **Data Structures — Stack and Queue Notes** | Data Structures | 3 | CSE | `stacks-and-queues-demo.pdf` | Raj Patel |
| 2 | **Mathematics — Differential Equations** | Mathematics | 3 | CSE | `differential-equations-demo.pdf` | Raj Patel |
| 3 | **Engineering Physics — Wave Optics** | Engineering Physics | 1 | CSE | `wave-optics-demo.pdf` | Ananya Sen |
| 4 | **Programming in C — Important Programs** | Programming in C | 1 | CSE | `programming-in-c-demo.pdf` | Raj Patel |
| 5 | **Database Management Systems — SQL Fundamentals** | Database Management Systems | 3 | CSE | `sql-fundamentals-demo.pdf` | Rohan Verma |
| 6 | **Computer Organization — Basic Concepts** | Computer Organization | 3 | CSE | `computer-organization-demo.pdf` | Raj Patel |

> 📄 *File Note: Demonstration filenames are realistic representations. The application generates actual downloadable sample PDF documents for preview and download evaluation.*

---

## 🚀 4. Key Functional Modules

1. **🔎 Smart Notes Explorer & Live Search:**
   - Real-time search across note title, subject, and topic.
   - Multi-parameter filtering by **Branch** (CSE, ECE, EEE, ME, CE, IT, AIML, DS), **Semester** (1 to 8), and **Subject**.
   - Multi-option sorting: **Recently Uploaded**, **Most Downloaded**, and **Highest Rated**.

2. **📄 Note Details & Document Preview:**
   - Full note metadata, syllabus topic tags, and uploader attribution.
   - Embedded PDF preview box and verified download button.
   - Peer ratings (1 to 5 stars) with a strict **one-rating-per-student** integrity rule.
   - Bookmark / Favorite toggle for quick revision.
   - Report inappropriate content modal with administrative tracking.

3. **📤 Notes Upload Form:**
   - Validates note title, description, subject, topic, branch, and semester.
   - Enforces **PDF file format only** with a configurable **10 MB file size limit**.
   - Displays upload progress bar and prevents orphaned files in storage.

4. **📊 Personalized Student Dashboard (Raj Patel):**
   - Summary statistics cards: Upload count (12), total downloads (248), saved notes (6).
   - Favorite subjects pills for fast one-click navigation.
   - Recent student activity timeline.
   - Manage uploaded notes with **Edit metadata** and **Delete** actions.

5. **🛡️ Administrator Moderator Panel:**
   - Access at `/admin` (Demo Admin login available).
   - Manage flagged/reported notes with status transitions (`pending` → `resolved`).
   - Remove inappropriate notes with automated storage and database synchronization.
   - Review platform statistics and student directory.

---

## 🛠️ 5. Technology Stack & Design System

- **Frontend:** React 19, Vite, JavaScript (ESModules)
- **Styling:** Vanilla Tailwind CSS (v4 with custom theme palette)
- **Color Palette:**
  - Primary Accent: Modern Blue (`#2563EB`)
  - Dark Navy Backgrounds: Dark Navy (`#0F172A`, `#1E293B`)
  - Neutral Backgrounds: Slate Off-White (`#F8FAFC`, `#FFFFFF`)
  - Success / Alert: Forest Green (`#16A34A`), Crimson Red (`#DC2626`)
- **Icons:** Lucide React (BookOpen, Download, Star, GraduationCap, Shield)
- **Routing:** React Router DOM (v7)
- **Notifications:** React Hot Toast
- **Database & Auth (Cloud Ready):** Supabase (PostgreSQL 15+, Supabase Auth, Supabase Storage)

---

## 💻 6. How to Run the Project in VS Code

### Step 1: Open the project folder in VS Code
```powershell
cd c:\Users\nirbh\OneDrive\Desktop\Online_Notes_Sharing
```

### Step 2: Install dependencies (if not already done)
```powershell
npm install
```

### Step 3: Run the development server
```powershell
npm run dev
```

### Step 4: Open in browser
Visit **`http://localhost:5173/`**

---

## 🧪 7. How to Test the Demo Dashboard & Notes Explorer

1. **Test Home Page & Branding:**
   - Visit `http://localhost:5173/`.
   - Check the **ShareNotes** logo, the tagline *"Share Knowledge. Grow Together."*, and the Ambalika ITM Lucknow project notice.

2. **Test Notes Explorer & Filtering:**
   - Click **Explore Notes** in the top navigation bar.
   - Type `"Stack"` or `"Differential"` in the search bar. Observe instant real-time results.
   - Click the **Semester 3** filter to view 3rd semester CSE subjects.
   - Change sort order to **Most Downloaded** or **Highest Rated**.

3. **Test Note Details & Download:**
   - Click on **"Data Structures — Stack and Queue Notes"**.
   - Notice the document preview box, uploader name (**Raj Patel**), and 4.9 rating.
   - Click **Download Notes** — an actual valid demonstration PDF is generated and downloaded, and the download counter increments.
   - Try the **Add to Favorites** button and **Report Note** button.

4. **Test Raj Patel's Student Dashboard:**
   - Click **Demo Dashboard** in the navigation bar (or log in via 1-click **"Demo Student (Raj Patel)"** on `/login`).
   - Notice the welcome header: *"Welcome back, Raj!"*.
   - Check the demonstration metrics: **12 Notes Uploaded**, **248 Downloads**, **6 Saved Notes**.
   - Explore the **Favorite Subjects** tags: Data Structures, Mathematics, Engineering Physics, Computer Organization.
   - Test editing note metadata via the **Edit** pencil icon.

5. **Test Uploading a Note:**
   - Click the **Upload Notes** button on the dashboard or navbar.
   - Fill in note details, attach a PDF, and click **Publish Notes**.
   - Observe the upload progress bar and confirmation toast.

6. **Test the Admin Dashboard:**
   - Navigate to `/login` and click **"Demo Admin"**.
   - Open `/admin` to review reported content, platform statistics, and moderation tools.

---

## 🎓 8. College Mini-Project Viva & Presentation Tips

When presenting ShareNotes to your evaluators:

1. **Problem Statement:** Explain how study materials at college are unorganized across WhatsApp/Telegram groups, leading to lost files before exams.
2. **Student-Centered Design:** Highlight how the platform is customized for B.Tech CSE students of Ambalika Institute of Technology and Management, Lucknow.
3. **Decoupled Architecture:** Emphasize that the React frontend is completely decoupled from the data layer, capable of operating in local evaluation mode or connecting to cloud PostgreSQL (Supabase) via environment variables.
4. **Security & Integrity:** Explain that Row Level Security (RLS) policies prevent unauthorized modifications, and duplicate rating constraints ensure fairness.

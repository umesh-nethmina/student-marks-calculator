# Student Performance Dashboard

A modern, industry-level student marks calculator with dynamic subjects, CRUD operations, and class performance analytics. Built with vanilla HTML, CSS, and JavaScript using localStorage for data persistence.

## 📋 Features

- **Section 1: Subject Management** – Add/delete global subjects
- **Section 2: Student Marks** – Add/update student marks for existing subjects
- **Section 3: Class Results** – View students sorted by average with statistics and grade badges
- **Full CRUD** – Create, read, update, and delete student records
- **Responsive Design** – Works seamlessly on mobile, tablet, and desktop
- **Data Persistence** – All data saved to browser localStorage
- **Grade Calculation** – Auto-calculate total, average, and letter grades
- **Statistics Dashboard** – View class-level stats (total, average, highest, lowest)

## 📁 Project Structure

```
student-marks-calculator/
├── frontend/
│   ├── index.html          # Main HTML page
│   ├── styles.css          # Styling (modern, industry-level)
│   └── app.js              # JavaScript logic (CRUD, storage)
├── backend/                # Optional Node.js API (if needed)
├── css/                    # Legacy CSS (root level)
├── js/                     # Legacy JS (root level)
├── README.md              # This file
└── LEARN.md               # Learning guide
```

## 🚀 Quick Start

### Option 1: Direct File Open (No Server)
1. Navigate to the project folder
2. Open `frontend/index.html` in your browser

### Option 2: Local HTTP Server (Recommended)

**Using Python:**
```bash
cd d:\PROJECTS\student-marks-calculator\frontend
python -m http.server 5500
# Open http://localhost:5500
```

**Using Node.js (http-server):**
```bash
cd d:\PROJECTS\student-marks-calculator\frontend
npx http-server -p 5500
# Open http://localhost:5500
```

**Using Node.js (Express Backend - Optional):**
```bash
cd d:\PROJECTS\student-marks-calculator\backend
npm install
node server.js
# Open http://localhost:3000
```

## 🎨 UI Sections

### Section 1: Add Subjects
- Input field to add subject names
- Displays current subjects as pills with delete (×) button
- Remove unwanted subjects dynamically

### Section 2: Add / Update Student Marks
- Enter student name
- Input marks for all existing subjects
- Save or update student record
- Form validation ensures name and marks are required

### Section 3: Class Results
- **Statistics Cards:** Total students, average score, highest/lowest
- **Results Table:** Sorted by average (highest to lowest)
- **Grade Display:** A/B/C/D/F badges
- **Actions:** Update or delete any student record

## 💾 Data Storage

Data is stored in browser **localStorage** under two keys:

- **`subjects_v1`** – Array of global subjects
- **`students_v2`** – Array of student records with marks

Example structure:
```json
{
  "id": "timestamp-random",
  "name": "John Doe",
  "subjects": { "Math": 85, "English": 90 },
  "total": 175,
  "average": 87.5,
  "grade": "A"
}
```

## 🔧 Usage Guide

### Adding a Subject
1. Go to **Section 1: Add Subjects**
2. Type subject name (e.g., "Mathematics")
3. Click **"Add Subject"**
4. Subject appears as a pill; marks inputs in Section 2 update automatically

### Adding a Student
1. Go to **Section 2: Add / Update Student Marks**
2. Enter **Student Name**
3. Fill in **Marks** for each subject (0-100)
4. Click **"Save Student"**
5. Student appears in Section 3 results table

### Updating a Student
1. In **Section 3**, find the student row
2. Click **"Update"** button
3. Edit modal opens; modify name and marks
4. Click **"Update"** to save
5. Table re-renders with updated data

### Deleting a Student
1. In **Section 3**, find the student row
2. Click **"Delete"** button
3. Student removed from results

### Deleting a Subject
1. In **Section 1**, locate the subject pill
2. Click the **×** button on the chip
3. Subject removed globally
4. Marks inputs in Section 2 update automatically
5. Existing student records retain their data

## 🎓 Grade Calculation

Grades are calculated based on **average marks**:

| Range      | Grade |
|-----------|-------|
| 90–100   | A     |
| 80–89    | B     |
| 70–79    | C     |
| 60–69    | D     |
| Below 60 | F     |

## 📱 Responsive Design

- **Desktop (900px+):** Full layout with 4-column grid for stats
- **Tablet/Mobile (<900px):** Single-column layout, stacked grids

## 🎨 Tech Stack

- **HTML5** – Semantic markup
- **CSS3** – Modern styling with CSS variables, flexbox, grid
- **Vanilla JavaScript** – No dependencies
- **localStorage API** – Data persistence

## 🔄 Browser Compatibility

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers

## 📝 Notes

- All data persists in **localStorage** (browser-specific, not synced across devices)
- No backend required for standalone use
- Export/import functionality can be added if needed
- To clear all data: Open browser DevTools → Storage/Application → localStorage → Delete `subjects_v1` and `students_v2`

## 🚀 Future Enhancements

- Export data to CSV/PDF
- Import student data from file
- Class-level performance charts
- Subject-level analytics
- Dark mode
- Data backup & restore
- Multi-class management

## 📄 License

Free to use and modify.

---

**Quick Links:**
- [Learn how to build this](./LEARN.md)
- [View source code](./frontend/)

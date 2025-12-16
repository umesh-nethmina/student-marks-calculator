// Student Performance Dashboard JS
// Data persistence in localStorage
const STORAGE_KEY = 'students_v2';
const SUBJECTS_KEY = 'subjects_v1';
let students = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let globalSubjects = JSON.parse(localStorage.getItem(SUBJECTS_KEY) || '[]');

// Elements
// Section 1: subject form
const subjectForm = document.getElementById('subjectForm');
const newSubjectName = document.getElementById('newSubjectName');
const subjectChips = document.getElementById('subjectChips');

// Section 2: student form
const form = document.getElementById('studentForm');
const nameInput = document.getElementById('studentName');
const subjectsContainer = document.getElementById('subjectsContainer');
const addSubjectBtn = document.getElementById('addSubjectBtn');
const tableHead = document.getElementById('tableHead');
const tableBody = document.getElementById('tableBody');

// Modal elements
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const editNameInput = document.getElementById('editStudentName');
const editSubjectsContainer = document.getElementById('editSubjectsContainer');
const addEditSubjectBtn = document.getElementById('addEditSubjectBtn');
const modalCloseBtn = document.getElementById('modalCloseBtn');
let editingId = null;

function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(students)); }
function saveSubjects() { localStorage.setItem(SUBJECTS_KEY, JSON.stringify(globalSubjects)); }
function uid() { return Date.now() + Math.random().toString(36).slice(2, 8); }

function addSubjectRow(container) {
  const row = document.createElement('div');
  row.className = 'subject-row';
  row.innerHTML = `
    <input type="text" class="input" placeholder="Subject name" />
    <input type="number" class="input" placeholder="Marks (0-100)" min="0" max="100" />
    <button type="button" class="remove-subject">×</button>
  `;
  row.querySelector('.remove-subject').addEventListener('click', () => {
    container.removeChild(row);
  });
  container.appendChild(row);
}

function collectSubjects(container) {
  const subjects = {};
  const rows = container.querySelectorAll('.subject-row');
  rows.forEach(r => {
    const [nameEl, markEl] = r.querySelectorAll('input');
    const subjectName = (nameEl.value || '').trim();
    const mark = Number(markEl.value);
    if (subjectName && !isNaN(mark)) subjects[subjectName] = mark;
  });
  return subjects;
}

function calculateTotals(subjects) {
  const marks = Object.values(subjects);
  const total = marks.reduce((a, b) => a + b, 0);
  const average = marks.length ? Math.round((total / marks.length) * 100) / 100 : 0;
  let grade = 'F';
  if (average >= 90) grade = 'A';
  else if (average >= 80) grade = 'B';
  else if (average >= 70) grade = 'C';
  else if (average >= 60) grade = 'D';
  return { total, average, grade };
}

function getAllSubjects() { return [...globalSubjects]; }

function renderSubjectChips() {
  if (!subjectChips) return;
  if (!globalSubjects.length) {
    subjectChips.innerHTML = '<div class="empty-state"><div class="empty-icon">📘</div><p>No subjects added yet.</p></div>';
    return;
  }
  subjectChips.innerHTML = globalSubjects.map(s => `
    <span class="chip" data-subject="${s}">
      <span>${s}</span>
      <button type="button" class="chip-del" title="Remove">×</button>
    </span>
  `).join('');
  subjectChips.querySelectorAll('.chip-del').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const sub = e.target.closest('.chip').getAttribute('data-subject');
      globalSubjects = globalSubjects.filter(x => x !== sub);
      saveSubjects();
      renderSubjectChips();
      renderSubjectsInputs();
    });
  });
}

function renderSubjectsInputs() {
  if (!subjectsContainer) return;
  subjectsContainer.innerHTML = '';
  if (!globalSubjects.length) {
    subjectsContainer.innerHTML = '<div class="empty-state"><div class="empty-icon">➕</div><p>Add subjects in Section 1 first.</p></div>';
    return;
  }
  globalSubjects.forEach(sub => {
    const row = document.createElement('div');
    row.className = 'subject-row';
    row.innerHTML = `
      <input type="text" class="input" value="${sub}" disabled />
      <input type="number" class="input" placeholder="Marks (0-100)" min="0" max="100" />
      <div></div>
    `;
    subjectsContainer.appendChild(row);
  });
}

function renderTable() {
  const subjects = getAllSubjects();
  tableHead.innerHTML = `
    <tr>
      <th>#</th>
      <th>Student</th>
      ${subjects.map(s => `<th>${s}</th>`).join('')}
      <th>Total</th>
      <th>Average</th>
      <th>Grade</th>
      <th>Actions</th>
    </tr>
  `;
  if (!students.length) {
    tableBody.innerHTML = `<tr><td colspan="${subjects.length + 6}"><div class="empty-state"><div class="empty-icon">📄</div><h3>No records yet</h3><p>Add students to see results</p></div></td></tr>`;
    return;
  }
  const sorted = [...students].sort((a, b) => b.average - a.average);
  tableBody.innerHTML = sorted.map((s, idx) => {
    const rowSubjects = subjects.map(sub => `<td>${s.subjects[sub] ?? '-'}</td>`).join('');
    return `
      <tr>
        <td>${idx + 1}</td>
        <td>${s.name}</td>
        ${rowSubjects}
        <td>${s.total}</td>
        <td>${s.average}</td>
        <td><span class="badge badge-${(s.grade || 'F').toLowerCase()}">${s.grade}</span></td>
        <td class="actions">
          <button class="button btn-update" data-id="${s.id}">Update</button>
          <button class="button btn-delete" data-id="${s.id}">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
  bindRowActions();
}

function bindRowActions() {
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      students = students.filter(s => s.id !== id);
      save();
      renderTable();
    });
  });
  document.querySelectorAll('.btn-update').forEach(btn => {
    btn.addEventListener('click', () => openEditModal(btn.getAttribute('data-id')));
  });
}

function openEditModal(id) {
  const s = students.find(st => st.id === id);
  if (!s) return;
  editingId = id;
  editNameInput.value = s.name;
  editSubjectsContainer.innerHTML = '';
  const subs = Object.entries(s.subjects || {});
  if (!subs.length) addEditSubjectRow(); else subs.forEach(([name, mark]) => addEditSubjectRow(name, mark));
  editModal.classList.add('show');
}

function addEditSubjectRow(name = '', mark = '') {
  const row = document.createElement('div');
  row.className = 'subject-row';
  row.innerHTML = `
    <input type="text" class="input" placeholder="Subject name" value="${name}" />
    <input type="number" class="input" placeholder="Marks (0-100)" min="0" max="100" value="${mark}" />
    <button type="button" class="remove-subject">×</button>
  `;
  row.querySelector('.remove-subject').addEventListener('click', () => editSubjectsContainer.removeChild(row));
  editSubjectsContainer.appendChild(row);
}

// Form handlers
if (addSubjectBtn) addSubjectBtn.addEventListener('click', () => addSubjectRow(subjectsContainer));
modalCloseBtn.addEventListener('click', () => editModal.classList.remove('show'));
addEditSubjectBtn.addEventListener('click', () => addEditSubjectRow());

subjectForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = (newSubjectName.value || '').trim();
  if (!name) return alert('Enter a subject name.');
  if (globalSubjects.includes(name)) return alert('Subject already exists.');
  globalSubjects.push(name);
  saveSubjects();
  newSubjectName.value = '';
  renderSubjectChips();
  renderSubjectsInputs();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = (nameInput.value || '').trim();
  const subjects = collectSubjects(subjectsContainer);
  if (!name || !Object.keys(subjects).length) return alert('Please enter a name and marks for subjects.');
  const { total, average, grade } = calculateTotals(subjects);
  students.push({ id: uid(), name, subjects, total, average, grade });
  save();
  form.reset();
  renderSubjectsInputs();
  renderTable();
});

editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const s = students.find(st => st.id === editingId);
  if (!s) return;
  const name = (editNameInput.value || '').trim();
  const subjects = collectSubjects(editSubjectsContainer);
  if (!name || !Object.keys(subjects).length) return alert('Please enter a name and at least one subject.');
  const { total, average, grade } = calculateTotals(subjects);
  Object.assign(s, { name, subjects, total, average, grade });
  save();
  editModal.classList.remove('show');
  renderTable();
});

// Init
renderSubjectChips();
renderSubjectsInputs();
renderTable();

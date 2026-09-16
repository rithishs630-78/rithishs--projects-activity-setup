// ===== Configuration =====
const API_BASE = "http://127.0.0.1:8000/api/students/";

// ===== DOM references =====
const form = document.getElementById('student-form');
const idField = document.getElementById('student-id');
const nameField = document.getElementById('name');
const emailField = document.getElementById('email');
const phoneField = document.getElementById('phone');
const courseField = document.getElementById('course');
const yearField = document.getElementById('year');
const marksField = document.getElementById('marks');

const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formMessage = document.getElementById('form-message');
const statusMessage = document.getElementById('status-message');
const tableBody = document.getElementById('student-table-body');
const searchBox = document.getElementById('search-box');

let allStudents = [];
let isEditing = false;

// ===== Helpers =====
function showFormMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = `message ${type}`;
  setTimeout(() => { formMessage.textContent = ''; }, 4000);
}

function clearFieldErrors() {
  document.querySelectorAll('.error').forEach(el => el.textContent = '');
}

function validateClientSide() {
  clearFieldErrors();
  let valid = true;

  if (!nameField.value.trim()) {
    document.getElementById('err-name').textContent = 'Name is required.';
    valid = false;
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailField.value.trim())) {
    document.getElementById('err-email').textContent = 'Enter a valid email.';
    valid = false;
  }
  if (!/^\d{10,15}$/.test(phoneField.value.trim())) {
    document.getElementById('err-phone').textContent = 'Enter a valid phone (10-15 digits).';
    valid = false;
  }
  if (!courseField.value.trim()) {
    document.getElementById('err-course').textContent = 'Course is required.';
    valid = false;
  }
  if (!yearField.value) {
    document.getElementById('err-year').textContent = 'Select a year.';
    valid = false;
  }
  const marks = parseFloat(marksField.value);
  if (isNaN(marks) || marks < 0 || marks > 100) {
    document.getElementById('err-marks').textContent = 'Marks must be between 0 and 100.';
    valid = false;
  }
  return valid;
}

function resetForm() {
  form.reset();
  idField.value = '';
  isEditing = false;
  formTitle.textContent = 'Add New Student';
  submitBtn.textContent = 'Add Student';
  cancelBtn.style.display = 'none';
  clearFieldErrors();
}

// ===== API calls (fetch) =====
async function fetchStudents() {
  statusMessage.textContent = 'Loading students...';
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to fetch students');
    const data = await res.json();
    allStudents = data.results || data; // handles paginated or plain list
    renderTable(allStudents);
    statusMessage.textContent = `${allStudents.length} student(s) found.`;
  } catch (err) {
    statusMessage.textContent = '⚠️ Could not connect to backend API. Is the Django server running on port 8000?';
    console.error(err);
  }
}

async function createStudent(payload) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

async function updateStudent(id, payload) {
  const res = await fetch(`${API_BASE}${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

async function deleteStudent(id) {
  const res = await fetch(`${API_BASE}${id}/`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Delete failed');
  return true;
}

// ===== Rendering =====
function renderTable(students) {
  tableBody.innerHTML = '';
  if (students.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:#9ca3af;">No records found.</td></tr>';
    return;
  }
  students.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.id}</td>
      <td>${escapeHtml(s.name)}</td>
      <td>${escapeHtml(s.email)}</td>
      <td>${escapeHtml(s.phone)}</td>
      <td>${escapeHtml(s.course)}</td>
      <td>${s.year}</td>
      <td>${s.marks}</td>
      <td>
        <button class="btn-small btn-edit" data-id="${s.id}">Edit</button>
        <button class="btn-small btn-delete" data-id="${s.id}">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

// ===== Event: form submit (Create / Update) =====
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateClientSide()) return;

  const payload = {
    name: nameField.value.trim(),
    email: emailField.value.trim(),
    phone: phoneField.value.trim(),
    course: courseField.value.trim(),
    year: parseInt(yearField.value, 10),
    marks: parseFloat(marksField.value)
  };

  try {
    if (isEditing) {
      await updateStudent(idField.value, payload);
      showFormMessage('Student updated successfully.', 'success');
    } else {
      await createStudent(payload);
      showFormMessage('Student added successfully.', 'success');
    }
    resetForm();
    fetchStudents();
  } catch (err) {
    clearFieldErrors();
    if (typeof err === 'object') {
      Object.keys(err).forEach(key => {
        const el = document.getElementById(`err-${key}`);
        if (el) el.textContent = Array.isArray(err[key]) ? err[key][0] : err[key];
      });
    }
    showFormMessage('Please fix the errors and try again.', 'error');
  }
});

// ===== Event: table actions (Edit / Delete) =====
tableBody.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains('btn-edit')) {
    const student = allStudents.find(s => String(s.id) === id);
    if (!student) return;
    idField.value = student.id;
    nameField.value = student.name;
    emailField.value = student.email;
    phoneField.value = student.phone;
    courseField.value = student.course;
    yearField.value = student.year;
    marksField.value = student.marks;
    isEditing = true;
    formTitle.textContent = `Edit Student #${student.id}`;
    submitBtn.textContent = 'Update Student';
    cancelBtn.style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (e.target.classList.contains('btn-delete')) {
    if (!confirm('Are you sure you want to delete this student record?')) return;
    try {
      await deleteStudent(id);
      fetchStudents();
    } catch (err) {
      alert('Failed to delete student.');
    }
  }
});

cancelBtn.addEventListener('click', resetForm);

// ===== Search / filter (client-side) =====
searchBox.addEventListener('input', () => {
  const q = searchBox.value.trim().toLowerCase();
  const filtered = allStudents.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.email.toLowerCase().includes(q) ||
    s.course.toLowerCase().includes(q)
  );
  renderTable(filtered);
});

// ===== Init =====
fetchStudents();

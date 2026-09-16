# Student Management System — CRUD Web Application

**Activity:** (CRUD-Based Web Application)
**Stack:** HTML, CSS, JavaScript (frontend) + Django REST Framework (backend) + SQLite (database)

\---

## 1\. Project Overview

A full-stack CRUD (Create, Read, Update, Delete) web application to manage student records. The frontend is a responsive vanilla HTML/CSS/JS single-page interface. The backend is a Django REST Framework API backed by an SQLite database.

## 2\. Problem Statement

Educational institutions need a simple way to add, view, update, and remove student records (name, email, phone, course, year, marks) with proper validation, rather than relying on spreadsheets or manual records.

## 3\. Objectives

* Implement full CRUD functionality for a `Student` entity.
* Build a REST API with server-side validation.
* Build a responsive frontend that consumes the API via `fetch`.
* Demonstrate real-time UI updates, search/filter, and error handling.

## 4\. Technology Stack

|Layer|Technology|
|-|-|
|Frontend|HTML5, CSS3, Vanilla JavaScript (fetch API)|
|Backend|Django 6 + Django REST Framework|
|Database|SQLite (default, zero-config)|
|API Testing|Postman / curl|
|CORS|django-cors-headers|

## 5\. System Architecture

```
Browser (HTML/CSS/JS, frontend/index.html)
        |  fetch() -> JSON over HTTP
        v
Django REST Framework API (http://127.0.0.1:8000/api/students/)
        |  Django ORM
        v
SQLite Database (db.sqlite3)
```

## 6\. Database Design (ER Summary)

**Table: `Student`**

|Field|Type|Constraints|
|-|-|-|
|id|Integer|Primary Key, Auto-increment|
|name|CharField(100)|NOT NULL|
|email|EmailField|NOT NULL, UNIQUE|
|phone|CharField(15)|NOT NULL|
|course|CharField(100)|NOT NULL|
|year|Integer|NOT NULL, 1–5|
|marks|Float|NOT NULL, 0–100|
|created\_at|DateTime|Auto-set on create|
|updated\_at|DateTime|Auto-set on update|

## 7\. API Endpoint Documentation

Base URL: `http://127.0.0.1:8000/api/students/`

|Operation|Method|Endpoint|Description|
|-|-|-|-|
|Create|POST|`/api/students/`|Add a new student|
|Read All|GET|`/api/students/`|List all students (supports `?search=`)|
|Read One|GET|`/api/students/{id}/`|Get one student|
|Update|PUT|`/api/students/{id}/`|Update a student|
|Delete|DELETE|`/api/students/{id}/`|Remove a student|

**Sample request body (POST/PUT):**

```json
{
  "name": "Arun Kumar",
  "email": "arun@example.com",
  "phone": "9876543210",
  "course": "B.Tech CSE",
  "year": 2,
  "marks": 85.5
}

{

&#x20;"name": "RITHISH",
"email": "rithish@123.com",
"phone": "9845643210",
"course": "B.Tech AIDS",
"year": 2,
"marks": 83.5

}
```

**Validation rules (server-side, in `students/serializers.py`):**

* `name` cannot be empty.
* `email` must be a valid, unique email address.
* `phone` must be at least 10 digits.
* `year` must be between 1 and 5.
* `marks` must be between 0 and 100.
* Invalid input returns HTTP `400` with a JSON error object per field.

## 8\. Installation \& Execution Steps

### Backend setup

```bash
cd backend  # or the project root containing manage.py
python -m venv venv
source venv/bin/activate      # Windows: venv\\Scripts\\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

Backend will run at `http://127.0.0.1:8000/`
Admin panel (optional): `python manage.py createsuperuser`, then visit `/admin/`.

### Frontend setup

No build step needed — it's plain HTML/CSS/JS.

```bash
cd frontend
# Open index.html directly in a browser, OR serve it:
python -m http.server 5500
```

Then visit `http://127.0.0.1:5500/index.html` (backend must already be running on port 8000).

> If your API runs on a different host/port, update `API\_BASE` at the top of `frontend/script.js`.

## 9\. CRUD Functionality — How to Test

1. **Create** — Fill the form on the left and click "Add Student". A new row appears in the table.
2. **Read** — All records load automatically on page load; use the search box to filter by name/email/course.
3. **Update** — Click "Edit" on any row, change values, click "Update Student".
4. **Delete** — Click "Delete" on any row and confirm the prompt.

## 10\. API Testing with curl / Postman

```bash
# Create
curl -X POST http://127.0.0.1:8000/api/students/ -H "Content-Type: application/json" \\
  -d '{"name":"Arun Kumar","email":"arun@test.com","phone":"9876543210","course":"CSE","year":2,"marks":85.5}'

# Read all
curl http://127.0.0.1:8000/api/students/

# Update
curl -X PUT http://127.0.0.1:8000/api/students/1/ -H "Content-Type: application/json" \\
  -d '{"name":"Arun K","email":"arun@test.com","phone":"9876543210","course":"CSE","year":3,"marks":90}'

# Delete
curl -X DELETE http://127.0.0.1:8000/api/students/1/
```

Test cases covered:

* Create with valid data → 201 Created
* Create with missing required field → 400 with field error
* Create with duplicate email → 400 (unique constraint)
* Read on empty DB → empty list, `count: 0`
* Update with invalid ID → 404 Not Found
* Delete with invalid ID → 404 Not Found

## 11\. Security \& Quality Notes

* No secrets are hard-coded; `SECRET\_KEY` should be moved to an environment variable for production use.
* Server-side validation exists independently of client-side validation.
* Django ORM (parameterized queries) is used throughout — no raw SQL.
* CORS is scoped for local development (`CORS\_ALLOW\_ALL\_ORIGINS = True`); restrict this to specific origins in production.

## 12\. Project Structure

```
student\_management\_system/
├── manage.py
├── requirements.txt
├── smsproject/          # Django project config
│   ├── settings.py
│   └── urls.py
├── students/             # Django app (model, serializer, views, urls)
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── admin.py
│   └── urls.py
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```

## 13\. Challenges \& Solutions

* **CORS blocking frontend requests** → resolved using `django-cors-headers`.
* **Validation duplication** → implemented both client-side (instant feedback) and server-side (data integrity) validation.

## 14\. Future Enhancements

* Add authentication (JWT) to protect the API.
* Add pagination controls and sorting in the UI.
* Deploy backend (Render/Railway) and frontend (Netlify/Vercel) for a live demo link.

## 


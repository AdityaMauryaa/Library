# 📚 Library Management System - Backend API

A RESTful API for managing library operations including student registration, book management, and borrowing system.

Frontend URL-https://library-two-pied.vercel.app/
Backend URL-https://library-76zf.onrender.com/

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Installation

```bash
# Clone repository
git clone https://github.com/AdityaMauryaa/Library.git
cd Library/Backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start server
npm start
```

### Environment Variables

```env
PORT=5000
MONGO_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## 👥 User Roles

| Role | Description |
|------|-------------|
| **Student** | Register, login, view books, view borrowed books & fines |
| **Administrator** | Full access: manage students, books, courses, borrowing |

---

## 📡 API Endpoints

**Base URL:** `http://localhost:5000/api`

### 1️⃣ Authentication

#### Register Student
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (409):**
```json
{
  "success": false,
  "message": "User already exists"
}
```

---

#### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Student"
  }
}
```

---

### 2️⃣ Courses

#### Get All Courses
```http
GET /api/courses
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "courseName": "Computer Science",
      "courseCode": "CS101",
      "description": "Introduction to CS"
    }
  ]
}
```

---

#### Add Course (Admin Only)
```http
POST /api/courses
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "courseName": "Computer Science",
  "courseCode": "CS101",
  "description": "Introduction to Computer Science"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "courseName": "Computer Science",
    "courseCode": "CS101",
    "description": "Introduction to Computer Science"
  }
}
```

---

#### Update Course (Admin Only)
```http
PUT /api/courses/:id
Authorization: Bearer <admin_token>
```

---

#### Delete Course (Admin Only)
```http
DELETE /api/courses/:id
Authorization: Bearer <admin_token>
```

---

### 3️⃣ Books

#### Get All Books (with Pagination)
```http
GET /api/books?page=1&limit=10&course=<course_id>
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "pages": 5,
  "currentPage": 1,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Introduction to Physics",
      "author": "Isaac Newton",
      "ISBN": "978-1234567890",
      "quantity": 10,
      "availableQty": 8,
      "course": {
        "_id": "507f1f77bcf86cd799439012",
        "courseName": "Physics"
      }
    }
  ]
}
```

---

#### Get Available Books
```http
GET /api/books/available
```

---

#### Search Books
```http
GET /api/books/search?q=physics
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Introduction to Physics",
      "author": "Isaac Newton"
    }
  ]
}
```

---

#### Get Book by ID
```http
GET /api/books/:id
```

---

#### Add Book (Admin Only)
```http
POST /api/books
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "title": "Introduction to Physics",
  "author": "Isaac Newton",
  "ISBN": "978-1234567890",
  "course": "507f1f77bcf86cd799439012",
  "quantity": 10
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Book added successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Introduction to Physics",
    "author": "Isaac Newton",
    "ISBN": "978-1234567890",
    "quantity": 10,
    "availableQty": 10
  }
}
```

---

#### Update Book (Admin Only)
```http
PUT /api/books/:id
Authorization: Bearer <admin_token>
```

---

#### Delete Book (Admin Only)
```http
DELETE /api/books/:id
Authorization: Bearer <admin_token>
```

---

### 4️⃣ Students (Admin Only)

#### Get All Students
```http
GET /api/students?page=1&limit=10
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "pages": 5,
  "currentPage": 1,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Student"
    }
  ]
}
```

---

#### Get Student by ID
```http
GET /api/students/:id
Authorization: Bearer <admin_token>
```

---

#### Update Student
```http
PUT /api/students/:id
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

---

#### Delete Student
```http
DELETE /api/students/:id
Authorization: Bearer <admin_token>
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Cannot delete student with borrowed books. Please return all books first."
}
```

---

#### Get Student's Borrowed Books
```http
GET /api/students/:id/borrowed-books
Authorization: Bearer <token>
```

---

### 5️⃣ Borrowing & Returns

#### Issue Book (Admin Only)
```http
POST /api/borrow
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "studentId": "507f1f77bcf86cd799439011",
  "bookId": "507f1f77bcf86cd799439012"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Book issued successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "studentId": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "bookId": {
      "title": "Introduction to Physics",
      "author": "Isaac Newton"
    },
    "issueDate": "2026-02-04T10:00:00.000Z",
    "dueDate": "2026-02-18T10:00:00.000Z",
    "status": "Borrowed"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Book is not available for borrowing"
}
```

---

#### Return Book (Admin Only)
```http
POST /api/return/:transactionId
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Book returned successfully. Fine: $4",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "returnDate": "2026-02-20T10:00:00.000Z",
    "fine": 4,
    "status": "Returned"
  }
}
```

---

#### Get All Borrowed Books (Admin Only)
```http
GET /api/borrowed?page=1&limit=10&status=Borrowed
Authorization: Bearer <admin_token>
```

---

#### Get My Borrowed Books (Student)
```http
GET /api/borrowed/my-books
Authorization: Bearer <student_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "totalFine": 6,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "bookId": {
        "title": "Introduction to Physics",
        "author": "Isaac Newton"
      },
      "issueDate": "2026-02-01T10:00:00.000Z",
      "dueDate": "2026-02-15T10:00:00.000Z",
      "status": "Borrowed",
      "currentFine": 6
    }
  ]
}
```

---

#### Get Overdue Books (Admin Only)
```http
GET /api/borrowed/overdue
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "studentId": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "bookId": {
        "title": "Introduction to Physics"
      },
      "dueDate": "2026-02-01T10:00:00.000Z",
      "daysOverdue": 3,
      "calculatedFine": 6
    }
  ]
}
```

---

### 6️⃣ Dashboard (Admin Only)

#### Get Statistics
```http
GET /api/dashboard/stats
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalBooks": 150,
    "totalStudents": 45,
    "booksIssuedToday": 8,
    "overdueBooks": 3,
    "totalFineCollected": 124,
    "currentlyBorrowed": 67,
    "availableBooks": 83
  }
}
```

---

## ❌ Error Codes

| Status Code | Meaning | Description |
|-------------|---------|-------------|
| `200` | OK | Request successful |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Invalid input or validation error |
| `401` | Unauthorized | Missing or invalid JWT token |
| `403` | Forbidden | Insufficient permissions (role-based) |
| `404` | Not Found | Resource does not exist |
| `409` | Conflict | Duplicate entry (email, ISBN, etc.) |
| `500` | Internal Server Error | Server-side error |

### Error Response Format

```json
{
  "success": false,
  "message": "Error description here"
}
```

### Validation Error Response

```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

---

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiry
- Tokens expire after **7 days**
- Re-login required after expiry

---

## 💰 Fine Calculation

- **Borrowing Period:** 14 days
- **Fine Rate:** $2 per day after due date
- **Fine Calculation:** `daysOverdue × $2`

---

## 📁 Project Structure

```
Backend/
├── src/
│   ├── config/
│   │   └── database.js       # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── borrowController.js
│   │   ├── courseController.js
│   │   ├── dashboardController.js
│   │   └── studentController.js
│   ├── middleware/
│   │   ├── auth.js           # JWT verification
│   │   ├── errorHandler.js   # Global error handler
│   │   └── roleCheck.js      # Role-based access
│   ├── models/
│   │   ├── Book.js
│   │   ├── BorrowedBook.js
│   │   ├── Course.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── borrowRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── studentRoutes.js
│   ├── utils/
│   │   └── jwt.js            # Token generation
│   └── server.js             # Express app entry
├── .env
├── package.json
└── README.md
```

---

## 📬 Postman Collection

Import the included Postman files for testing:

1. `Library-Management-API-Simple.postman_collection.json`
2. `Library-Management.postman_environment.json`

See `POSTMAN_GUIDE.md` for detailed testing instructions.

---

## 📝 License

MIT License

---

**Author:** Aditya Maurya  
**Repository:** https://github.com/AdityaMauryaa/Library

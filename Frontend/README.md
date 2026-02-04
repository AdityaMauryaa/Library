# 📚 Library Management System

A full-stack Library Management System built with **React.js**, **Node.js/Express.js**, and **MongoDB** that enables students to register for courses and borrow books, while administrators can manage the entire library system.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![React](https://img.shields.io/badge/react-19.2.0-blue.svg)
![MongoDB](https://img.shields.io/badge/mongodb-6.0-green.svg)

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [API Specification](#-api-specification)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Error Handling](#-error-handling)
- [Security Guidelines](#-security-guidelines)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 📄 Problem Statement

Develop a backend service for handling **student registration** in a library's database and keeping track of necessary operations for the library like books coming in, borrowed, etc. The service should accept registration requests via a **RESTful API** and respond with a confirmation or rejection message to the student.

### Key Requirements:
- Students can select a course from a list of courses and register for it
- All endpoints for basic CRUD operations on students and books tables should be available for administration with proper privileged authentication
- **JWT-based authentication** with two user roles: **Student** and **Administrator**

---

## ✨ Features

### 👨‍🎓 Student Features
| Feature | Description |
|---------|-------------|
| Registration | Register with course selection |
| View Available Books | Check all available books in library |
| Borrowed Books | View list of currently borrowed books |
| Due Dates | Check last date to return books |
| Due Amount | View fine/due amount for late returns |

### 👨‍💼 Administrator Features
| Feature | Description |
|---------|-------------|
| Manage Students | Edit and manage registrations of any student |
| Manage Books | Add, edit, delete books in the library |
| View Borrowed Books | Check borrowed books list and by whom |
| Stock Updates | Update book quantities and availability |

### 🔐 Registration Service
- Authenticate the student
- Validate the registration request and ensure all required data
- Store the registration data in database
- Respond with confirmation or rejection message

### 📚 Library Service
- Authenticate the administrator
- Validate necessary requests by ensuring required details
- Store or update the database with proper requests
- Respond with confirmation or rejection message

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React.js | 19.x | UI Library |
| Vite | 7.x | Build Tool & Dev Server |
| React Router | 6.x | Client-side Routing |
| Axios | 1.x | HTTP Client |
| React Toastify | 10.x | Toast Notifications |
| CSS | - | Styling |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x+ | Runtime Environment |
| Express.js | 5.x | Web Framework |
| MongoDB | 6.x | Database |
| Mongoose | 8.x | ODM for MongoDB |
| JWT | - | Authentication |
| bcrypt | 5.x | Password Hashing |
| Joi | 17.x | Request Validation |
| cors | 2.x | Cross-Origin Requests |
| dotenv | 16.x | Environment Variables |

---

## 📊 Database Schema

### Users/Students Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['student', 'admin'], default: 'student'),
  courseId: ObjectId (ref: 'Course'),
  phone: String,
  address: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Books Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  author: String (required),
  ISBN: String (required, unique),
  category: String,
  quantity: Number (required, default: 1),
  availableQuantity: Number (required),
  description: String,
  publishedYear: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Courses Collection
```javascript
{
  _id: ObjectId,
  courseName: String (required),
  courseCode: String (required, unique),
  description: String,
  duration: String,
  createdAt: Date,
  updatedAt: Date
}
```

### BorrowedBooks/Transactions Collection
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: 'User', required),
  bookId: ObjectId (ref: 'Book', required),
  issueDate: Date (required, default: now),
  dueDate: Date (required),
  returnDate: Date,
  fine: Number (default: 0),
  status: String (enum: ['issued', 'returned', 'overdue'], default: 'issued'),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Specification

### Authentication APIs

#### Register Student
```http
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "courseId": "64abc123def456789",
  "phone": "1234567890"
}

Success Response (201 Created):
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": { "id", "name", "email", "role", "course" },
    "token": "jwt_token_here"
  }
}

Error Response (400 Bad Request):
{
  "success": false,
  "message": "Validation error",
  "errors": ["Email is required", "Password must be at least 6 characters"]
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Success Response (200 OK):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id", "name", "email", "role" },
    "token": "jwt_token_here"
  }
}

Error Response (401 Unauthorized):
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Book APIs

#### Get All Books (with Pagination)
```http
GET /api/books?page=1&limit=10&search=javascript
Authorization: Bearer <token>

Success Response (200 OK):
{
  "success": true,
  "data": {
    "books": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalBooks": 50,
      "hasMore": true
    }
  }
}
```

#### Add New Book (Admin Only)
```http
POST /api/books
Authorization: Bearer <admin_token>
Content-Type: application/json

Request Body:
{
  "title": "JavaScript: The Good Parts",
  "author": "Douglas Crockford",
  "ISBN": "978-0596517748",
  "category": "Programming",
  "quantity": 5,
  "description": "A book about JavaScript best practices"
}

Success Response (201 Created):
{
  "success": true,
  "message": "Book added successfully",
  "data": { "book": {...} }
}
```

### Borrowing APIs

#### Issue Book
```http
POST /api/borrow
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "bookId": "64abc123def456789",
  "studentId": "64xyz789abc123456",  // Admin only, students use their own ID
  "dueDate": "2026-02-20"
}

Success Response (201 Created):
{
  "success": true,
  "message": "Book issued successfully",
  "data": {
    "transaction": {
      "id": "...",
      "book": "JavaScript: The Good Parts",
      "dueDate": "2026-02-20",
      "fine": 0
    }
  }
}

Error Response (400 Bad Request):
{
  "success": false,
  "message": "Book not available"
}
```

#### Get My Borrowed Books (Student)
```http
GET /api/borrowed/my-books
Authorization: Bearer <student_token>

Success Response (200 OK):
{
  "success": true,
  "data": {
    "borrowedBooks": [
      {
        "id": "...",
        "book": { "title", "author", "ISBN" },
        "issueDate": "2026-02-01",
        "dueDate": "2026-02-15",
        "status": "issued",
        "fine": 0
      }
    ],
    "totalDueAmount": 0
  }
}
```

---

## 📁 Project Structure

```
Library/
├── Backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── studentController.js
│   │   ├── courseController.js
│   │   └── borrowController.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT verification
│   │   ├── roleMiddleware.js  # Role-based access
│   │   └── errorMiddleware.js # Error handling
│   ├── models/
│   │   ├── User.js
│   │   ├── Book.js
│   │   ├── Course.js
│   │   └── BorrowedBook.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── courseRoutes.js
│   │   └── borrowRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── validators.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js              # Entry point
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/        # Navbar, Footer, Loading, etc.
│   │   │   ├── books/         # Book-related components
│   │   │   └── forms/         # Form components
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── auth/          # Login, Register
│   │   │   ├── admin/         # Admin Dashboard, Manage Books/Students
│   │   │   └── student/       # Student Dashboard, My Books
│   │   ├── services/
│   │   │   └── api.js         # Axios instance & API calls
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── TODO.md
└── README.md
```

---

## 📋 Prerequisites

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0.0 or higher) or **yarn**
- **MongoDB** (v6.0 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git** - [Download](https://git-scm.com/)
- **Postman** - [Download](https://www.postman.com/downloads/) (for API testing)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/library-management-system.git
cd library-management-system
```

### 2. Install Backend Dependencies

```bash
cd Backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../Frontend
npm install
```

### 4. Environment Setup

Create a `.env` file in the `Backend` folder:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/library_db
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/library_db

# JWT Configuration
JWT_SECRET=your_super_secret_key_here_min_32_chars
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173

# Fine Configuration (optional)
FINE_PER_DAY=5
MAX_BORROW_DAYS=14
MAX_BOOKS_PER_STUDENT=3
```

---

## ▶️ Running the Application

### Start MongoDB (if running locally)

```bash
mongod
```

### Start Backend Server

```bash
cd Backend
npm run dev
# Server runs on http://localhost:5000
```

### Start Frontend Development Server

```bash
cd Frontend
npm run dev
# App runs on http://localhost:5173
```

### Build for Production

```bash
# Frontend
cd Frontend
npm run build
npm run preview
```

---

## 🔌 API Endpoints Summary

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new student | Public |
| POST | `/api/auth/login` | User login | Public |
| GET | `/api/auth/profile` | Get current user profile | Protected |

### Courses
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/courses` | Get all courses | Public |
| POST | `/api/courses` | Add new course | Admin |
| PUT | `/api/courses/:id` | Update course | Admin |
| DELETE | `/api/courses/:id` | Delete course | Admin |

### Books
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/books` | Get all books (paginated) | Protected |
| GET | `/api/books/available` | Get available books | Protected |
| GET | `/api/books/:id` | Get single book | Protected |
| POST | `/api/books` | Add new book | Admin |
| PUT | `/api/books/:id` | Update book | Admin |
| DELETE | `/api/books/:id` | Delete book | Admin |

### Students (Admin Only)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/students` | Get all students | Admin |
| GET | `/api/students/:id` | Get single student | Admin |
| PUT | `/api/students/:id` | Update student | Admin |
| DELETE | `/api/students/:id` | Delete student | Admin |

### Borrowing
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/borrow` | Issue a book | Protected |
| POST | `/api/return/:id` | Return a book | Protected |
| GET | `/api/borrowed` | Get all transactions | Admin |
| GET | `/api/borrowed/my-books` | Get user's borrowed books | Student |
| GET | `/api/borrowed/overdue` | Get overdue books | Admin |

---

## ❌ Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"],  // Optional
  "stack": "Error stack trace"  // Only in development
}
```

### HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Validation error or invalid data |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions (role-based) |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate entry (email, ISBN, etc.) |
| 500 | Internal Server Error | Server-side error |

### Common Error Scenarios

| Scenario | Status | Message |
|----------|--------|---------|
| Missing required field | 400 | "Field 'name' is required" |
| Invalid email format | 400 | "Please provide a valid email" |
| Duplicate email | 409 | "Email already registered" |
| Invalid credentials | 401 | "Invalid email or password" |
| Token expired | 401 | "Token expired, please login again" |
| Non-admin accessing admin route | 403 | "Access denied. Admin only." |
| Book not found | 404 | "Book not found" |
| Book not available | 400 | "Book is not available for borrowing" |

---

## 🔐 Security Guidelines

### Authentication & Authorization

1. **JWT Token Implementation**
   - Tokens are signed with a secret key
   - Token expiry is set (default: 7 days)
   - Tokens must be sent in Authorization header

2. **Password Security**
   - Passwords are hashed using bcrypt (10 salt rounds)
   - Minimum password length: 6 characters
   - Passwords are never returned in API responses

3. **Role-Based Access Control**
   - Two roles: `student` and `admin`
   - Admin-only routes are protected by role middleware
   - Students can only access their own data

### API Security Best Practices

```javascript
// Token in Header
Authorization: Bearer <jwt_token>

// Protected Route Example
router.get('/books', authMiddleware, getBooks);

// Admin-Only Route Example
router.post('/books', authMiddleware, adminMiddleware, addBook);
```

---

## 🧪 Testing

### Using Postman

1. Import the Postman collection (provided in `/postman` folder)
2. Set up environment variables:
   - `base_url`: `http://localhost:5000`
   - `token`: (set after login)

### Test Cases

| Test Case | Expected Outcome |
|-----------|------------------|
| Register with valid data | 201 Created |
| Register with existing email | 409 Conflict |
| Login with valid credentials | 200 OK + Token |
| Login with invalid password | 401 Unauthorized |
| Access protected route without token | 401 Unauthorized |
| Admin access student-only route | 403 Forbidden |
| Get books with pagination | 200 OK + Paginated data |
| Borrow unavailable book | 400 Bad Request |

---

## 🚀 Deployment

### Backend Deployment (Render/Railway)

1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)

```bash
cd Frontend
npm run build
# Deploy the 'dist' folder
```

### MongoDB Atlas Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create database user
3. Whitelist IP addresses
4. Get connection string and update `.env`

---

## 📦 Deliverables

- [x] Complete source code on GitHub
- [ ] Postman collection for API validation
- [x] Comprehensive README documentation
- [x] API specification with request/response formats
- [x] Database schema documentation
- [x] Error handling documentation
- [ ] Test cases with expected outcomes
- [x] Security guidelines
- [x] Deployment instructions

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)

---

⭐ **Star this repository if you found it helpful!**

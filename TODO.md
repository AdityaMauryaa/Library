# 📋 Library Management System - TODO List

## 🎯 Project Overview
Build a full-stack Library Management System for handling **student registration** and **book management** using React (Frontend), Node.js/Express (Backend), and MongoDB (Database).

### 👥 User Roles
- **Student**: Check available books, due amount, borrowed books, return dates
- **Administrator**: Manage students, manage books, view borrowed books list

---

## 📌 Phase 1: Project Setup & Configuration

### Backend Setup
- [x] Initialize Express.js server with proper folder structure
- [x] Set up MongoDB database connection using Mongoose
- [x] Configure environment variables (.env file)
- [x] Set up CORS middleware for frontend communication
- [x] Create folder structure (routes, controllers, models, middleware, config)
- [x] Set up error handling middleware
- [x] Configure morgan for request logging

### Frontend Setup
- [x] Install dependencies (React Router, Axios, React Toastify)
- [x] Set up project folder structure (components, pages, services, context)
- [x] Configure React Router for navigation
- [x] Set up Axios instance with base URL
- [x] Create authentication context for state management

### Database Setup
- [x] Design MongoDB schemas for all collections
- [x] Create Student schema
- [x] Create Book schema
- [x] Create Course schema
- [x] Create BorrowedBook

---

## 📌 Phase 2: Authentication Module (JWT Based)

### Backend - Auth APIs
- [x] Create User/Student model with role field (Student, Administrator)
- [x] POST `/api/auth/register` - Student registration
- [x] POST `/api/auth/login` - User login (returns JWT token)
- [x] GET `/api/auth/profile` - Get logged in user profile
- [x] Create JWT token generation utility
- [x] Create auth middleware to protect routes
- [x] Create role-based authorization middleware

### Frontend - Auth Pages
- [x] Create Login page with form validation
- [x] Create Student Registration page
- [x] Implement JWT token storage (localStorage/cookies)
- [x] Create Protected Route component
- [x] Create Auth Context for global state
- [x] Handle token expiry and auto-logout
- [x] Add role-based route protection

---

## 📌 Phase 3: Course Management Module

### Backend - Course APIs
- [x] Create Course model (courseName, courseCode, description)
- [x] GET `/api/courses` - Get all courses (for registration dropdown)
- [x] POST `/api/courses` - Add new course (Admin only)
- [x] PUT `/api/courses/:id` - Update course (Admin only)
- [x] DELETE `/api/courses/:id` - Delete course (Admin only)

### Frontend - Course Features
- [x] Course selection dropdown in registration
- [x] Course management page (Admin only)
- [x] Add/Edit course form

---

## 📌 Phase 4: Book Management Module

### Backend - Book APIs
- [x] Create Book model (title, author, ISBN, quantity, availableQty, category)
- [x] GET `/api/books` - Get all books with pagination
- [x] GET `/api/books/available` - Get available books only
- [x] GET `/api/books/:id` - Get single book details
- [x] POST `/api/books` - Add new book (Admin only)
- [x] PUT `/api/books/:id` - Update book (Admin only)
- [x] DELETE `/api/books/:id` - Delete book (Admin only)
- [x] GET `/api/books/search?q=query` - Search books by title/author

### Frontend - Book Features
- [x] Book listing page with search & filters
- [x] Book details page showing availability
- [x] Add Book form (Admin only)
- [x] Edit Book form (Admin only)
- [x] Delete book functionality (Admin only)
- [x] Implement pagination for book list

---

## 📌 Phase 5: Student Management Module (Admin Only)

### Backend - Student APIs
- [x] GET `/api/students` - Get all students with pagination (Admin)
- [x] GET `/api/students/:id` - Get single student details (Admin)
- [x] PUT `/api/students/:id` - Update student info (Admin)
- [x] DELETE `/api/students/:id` - Delete student (Admin)
- [x] GET `/api/students/:id/borrowed-books` - Get student's borrowed books

### Frontend - Student Management
- [x] Student list page with search (Admin)
- [x] Student details page with borrowing history
- [x] Edit student form
- [x] View student's borrowed books

---

## 📌 Phase 6: Book Borrowing & Return Module

### Backend - Transaction APIs
- [x] Create BorrowedBook model (studentId, bookId, issueDate, dueDate, returnDate, status)
- [x] POST `/api/borrow` - Issue book to student
- [x] POST `/api/return/:transactionId` - Return a book
- [x] GET `/api/borrowed` - Get all borrowed books (Admin)
- [x] GET `/api/borrowed/my-books` - Get current user's borrowed books (Student)
- [x] GET `/api/borrowed/overdue` - Get overdue books list (Admin)
- [x] Update book availability on issue/return

### Frontend - Borrowing Features
- [x] **Student View:**
  - [x] View borrowed books list
  - [x] Check due dates (Last date to return)
  - [x] View due amount/fine
  - [x] Check available books
- [x] **Admin View:**
  - [x] Issue book to student form
  - [x] Return book form
  - [x] View all borrowed books with borrower info
  - [x] View overdue books list

---

## 📌 Phase 7: Dashboard & Reports

### Backend - Analytics APIs
- [x] GET `/api/dashboard/stats` - Get dashboard statistics
  - Total books count
  - Total students count
  - Books issued today
  - Overdue books count
  - Total fine collected

### Frontend - Dashboard
- [x] Admin Dashboard with statistics cards
- [x] Student Dashboard with personal stats
- [ ] Display charts for analytics (optional)

---

## 📌 Phase 8: API Documentation & Validation

### Postman Collection
- [x] Create Simple api for postman dont make it complicated simple 
- [x] Add environment variables (base_url, token)
- [x] Document request/response formats for each endpoint
- [x] Add example requests with valid data
- [x] Add example requests with invalid data (for error testing)
- [x] Export collection for submission

### API Documentation
- [x] Document all API endpoints in README
- [x] Include request/response formats
- [x] Document error codes and HTTP status codes
- [x] Add usage examples

---

## 📌 Phase 9: Error Handling & Validation

### Backend
- [x] Implement consistent error response format
- [x] Add request validation using Joi/express-validator
- [x] Handle MongoDB duplicate key errors
- [x] Handle invalid ObjectId errors
- [x] Return appropriate HTTP status codes:
  - 200 OK
  - 201 Created
  - 400 Bad Request
  - 401 Unauthorized
  - 403 Forbidden
  - 404 Not Found
  - 409 Conflict
  - 500 Internal Server Error

### Frontend
- [x] Display user-friendly error messages
- [x] Add form validations
- [x] Handle API errors gracefully
- [x] Show toast notifications for success/error

---

## 📌 Phase 10: UI/UX Enhancements

- [x] Implement responsive design
- [x] Add loading spinners/skeletons
- [x] Implement toast notifications
- [x] Better admin UX for stock updates
- [x] Pagination for extensive lists
- [x] Clean and intuitive navigation
- [x] Form validation feedback

---

## 📌 Phase 11: Testing

- [ ] Test all API endpoints with valid requests
- [ ] Test all API endpoints with invalid requests
- [ ] Document test cases and expected outcomes
- [ ] Test authentication flow
- [ ] Test authorization (role-based access)
- [ ] Test error scenarios

---

## 📌 Phase 12: Deployment & CI/CD

### GitHub & Version Control
- [x] Initialize Git repository
- [x] Create .gitignore file
- [ ] Make meaningful commits
- [ ] Push code to GitHub

### CI/CD Pipeline (Nice to have)
- [ ] Set up GitHub Actions workflow
- [ ] Configure automated testing
- [ ] Configure automated deployment

### Cloud Deployment (Nice to have)
- [ ] Deploy backend to cloud (Render/Railway/Heroku)
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Set up MongoDB Atlas for database
- [ ] Configure production environment variables

---

## 📦 Deliverables Checklist

- [ ] Complete source code on GitHub
- [x] Postman collection demonstrating all APIs
- [x] Comprehensive README documentation
- [x] API specification with request/response formats
- [x] Database schema documentation
- [x] Error handling documentation
- [ ] Test cases documentation
- [x] Security guidelines (auth & authorization)
- [ ] Deployment instructions

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, Vite, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT (JSON Web Tokens), bcrypt |
| Validation | Joi / express-validator |
| API Testing | Postman |
| Version Control | Git, GitHub |

---

## 📝 HTTP Status Codes Reference

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate entry |
| 500 | Internal Server Error | Server errors |

---

**Last Updated:** February 4, 2026


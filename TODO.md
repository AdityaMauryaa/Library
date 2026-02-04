# 📋 Library Management System - TODO List

## 🎯 Project Overview
Build a full-stack Library Management System for handling **student registration** and **book management** using React (Frontend), Node.js/Express (Backend), and MongoDB (Database).

### 👥 User Roles
- **Student**: Check available books, due amount, borrowed books, return dates
- **Administrator**: Manage students, manage books, view borrowed books list

---

## 📌 Phase 1: Project Setup & Configuration

### Backend Setup
- [ ] Initialize Express.js server with proper folder structure
- [ ] Set up MongoDB database connection using Mongoose
- [ ] Configure environment variables (.env file)
- [ ] Set up CORS middleware for frontend communication
- [ ] Create folder structure (routes, controllers, models, middleware, config)
- [ ] Set up error handling middleware
- [ ] Configure morgan for request logging

### Frontend Setup
- [ ] Install dependencies (React Router, Axios, React Toastify)
- [ ] Set up project folder structure (components, pages, services, context)
- [ ] Configure React Router for navigation
- [ ] Set up Axios instance with base URL
- [ ] Create authentication context for state management

### Database Setup
- [ ] Design MongoDB schemas for all collections
- [ ] Create Student schema
- [ ] Create Book schema
- [ ] Create Course schema
- [ ] Create BorrowedBook/Transaction schema
- [ ] Add appropriate indexes for performance

---

## 📌 Phase 2: Authentication Module (JWT Based)

### Backend - Auth APIs
- [ ] Create User/Student model with role field (Student, Administrator)
- [ ] POST `/api/auth/register` - Student registration
- [ ] POST `/api/auth/login` - User login (returns JWT token)
- [ ] GET `/api/auth/profile` - Get logged in user profile
- [ ] Create JWT token generation utility
- [ ] Implement password hashing with bcrypt
- [ ] Create auth middleware to protect routes
- [ ] Create role-based authorization middleware

### Frontend - Auth Pages
- [ ] Create Login page with form validation
- [ ] Create Student Registration page
- [ ] Implement JWT token storage (localStorage/cookies)
- [ ] Create Protected Route component
- [ ] Create Auth Context for global state
- [ ] Handle token expiry and auto-logout
- [ ] Add role-based route protection

---

## 📌 Phase 3: Course Management Module

### Backend - Course APIs
- [ ] Create Course model (courseName, courseCode, description)
- [ ] GET `/api/courses` - Get all courses (for registration dropdown)
- [ ] POST `/api/courses` - Add new course (Admin only)
- [ ] PUT `/api/courses/:id` - Update course (Admin only)
- [ ] DELETE `/api/courses/:id` - Delete course (Admin only)

### Frontend - Course Features
- [ ] Course selection dropdown in registration
- [ ] Course management page (Admin only)
- [ ] Add/Edit course form

---

## 📌 Phase 4: Book Management Module

### Backend - Book APIs
- [ ] Create Book model (title, author, ISBN, quantity, availableQty, category)
- [ ] GET `/api/books` - Get all books with pagination
- [ ] GET `/api/books/available` - Get available books only
- [ ] GET `/api/books/:id` - Get single book details
- [ ] POST `/api/books` - Add new book (Admin only)
- [ ] PUT `/api/books/:id` - Update book (Admin only)
- [ ] DELETE `/api/books/:id` - Delete book (Admin only)
- [ ] GET `/api/books/search?q=query` - Search books by title/author

### Frontend - Book Features
- [ ] Book listing page with search & filters
- [ ] Book details page showing availability
- [ ] Add Book form (Admin only)
- [ ] Edit Book form (Admin only)
- [ ] Delete book functionality (Admin only)
- [ ] Implement pagination for book list

---

## 📌 Phase 5: Student Management Module (Admin Only)

### Backend - Student APIs
- [ ] GET `/api/students` - Get all students with pagination (Admin)
- [ ] GET `/api/students/:id` - Get single student details (Admin)
- [ ] PUT `/api/students/:id` - Update student info (Admin)
- [ ] DELETE `/api/students/:id` - Delete student (Admin)
- [ ] GET `/api/students/:id/borrowed-books` - Get student's borrowed books

### Frontend - Student Management
- [ ] Student list page with search (Admin)
- [ ] Student details page with borrowing history
- [ ] Edit student form
- [ ] View student's borrowed books

---

## 📌 Phase 6: Book Borrowing & Return Module

### Backend - Transaction APIs
- [ ] Create BorrowedBook model (studentId, bookId, issueDate, dueDate, returnDate, fine, status)
- [ ] POST `/api/borrow` - Issue book to student
- [ ] POST `/api/return/:transactionId` - Return a book
- [ ] GET `/api/borrowed` - Get all borrowed books (Admin)
- [ ] GET `/api/borrowed/my-books` - Get current user's borrowed books (Student)
- [ ] GET `/api/borrowed/overdue` - Get overdue books list (Admin)
- [ ] Calculate fine for late returns automatically
- [ ] Update book availability on issue/return

### Frontend - Borrowing Features
- [ ] **Student View:**
  - [ ] View borrowed books list
  - [ ] Check due dates (Last date to return)
  - [ ] View due amount/fine
  - [ ] Check available books
- [ ] **Admin View:**
  - [ ] Issue book to student form
  - [ ] Return book form
  - [ ] View all borrowed books with borrower info
  - [ ] View overdue books list

---

## 📌 Phase 7: Dashboard & Reports

### Backend - Analytics APIs
- [ ] GET `/api/dashboard/stats` - Get dashboard statistics
  - Total books count
  - Total students count
  - Books issued today
  - Overdue books count
  - Total fine collected

### Frontend - Dashboard
- [ ] Admin Dashboard with statistics cards
- [ ] Student Dashboard with personal stats
- [ ] Display charts for analytics (optional)

---

## 📌 Phase 8: API Documentation & Validation

### Postman Collection
- [ ] Create Postman collection for all APIs
- [ ] Add environment variables (base_url, token)
- [ ] Document request/response formats for each endpoint
- [ ] Add example requests with valid data
- [ ] Add example requests with invalid data (for error testing)
- [ ] Export collection for submission

### API Documentation
- [ ] Document all API endpoints in README
- [ ] Include request/response formats
- [ ] Document error codes and HTTP status codes
- [ ] Add usage examples

---

## 📌 Phase 9: Error Handling & Validation

### Backend
- [ ] Implement consistent error response format
- [ ] Add request validation using Joi/express-validator
- [ ] Handle MongoDB duplicate key errors
- [ ] Handle invalid ObjectId errors
- [ ] Return appropriate HTTP status codes:
  - 200 OK
  - 201 Created
  - 400 Bad Request
  - 401 Unauthorized
  - 403 Forbidden
  - 404 Not Found
  - 409 Conflict
  - 500 Internal Server Error

### Frontend
- [ ] Display user-friendly error messages
- [ ] Add form validations
- [ ] Handle API errors gracefully
- [ ] Show toast notifications for success/error

---

## 📌 Phase 10: UI/UX Enhancements

- [ ] Implement responsive design
- [ ] Add loading spinners/skeletons
- [ ] Implement toast notifications
- [ ] Better admin UX for stock updates
- [ ] Pagination for extensive lists
- [ ] Clean and intuitive navigation
- [ ] Form validation feedback

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
- [ ] Initialize Git repository
- [ ] Create .gitignore file
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
- [ ] Postman collection demonstrating all APIs
- [ ] Comprehensive README documentation
- [ ] API specification with request/response formats
- [ ] Database schema documentation
- [ ] Error handling documentation
- [ ] Test cases documentation
- [ ] Security guidelines (auth & authorization)
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


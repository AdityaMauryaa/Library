# 📚 Library Management System API - Postman Guide

## 🚀 Quick Start

### 1. Import Files into Postman

1. **Import Collection:**
   - Open Postman
   - Click "Import" button
   - Select `Library-Management-API-Simple.postman_collection.json`

2. **Import Environment:**
   - Click "Import" button
   - Select `Library-Management.postman_environment.json`
   - Select the environment from the dropdown (top-right corner)

### 2. Set Environment Variables

The environment comes with these variables:
- `base_url`: `http://localhost:5000` (already set)
- `token`: Empty (auto-filled after login)
- `admin_token`: Empty (manually set after admin login)
- `student_token`: Empty (auto-filled after student registration)

## 📋 API Endpoints Overview

### 1️⃣ Authentication
- **Register Student** - `POST /api/auth/register`
- **Login** - `POST /api/auth/login`
- **Get Profile** - `GET /api/auth/profile` (requires auth)

### 2️⃣ Courses
- **Get All Courses** - `GET /api/courses` (public)
- **Add Course** - `POST /api/courses` (admin only)

### 3️⃣ Books
- **Get All Books** - `GET /api/books?page=1&limit=10` (public)
- **Get Available Books** - `GET /api/books/available` (public)
- **Search Books** - `GET /api/books/search?q=physics` (public)
- **Add Book** - `POST /api/books` (admin only)

### 4️⃣ Students
- **Get All Students** - `GET /api/students?page=1&limit=10` (admin only)

### 5️⃣ Borrowing
- **Issue Book** - `POST /api/borrow` (admin only)
- **Return Book** - `POST /api/return/:transactionId` (admin only)
- **My Borrowed Books** - `GET /api/borrowed/my-books` (student)
- **Get Overdue Books** - `GET /api/borrowed/overdue` (admin only)

### 6️⃣ Dashboard
- **Get Statistics** - `GET /api/dashboard/stats` (admin only)

## 🔑 How to Test

### Step 1: Register and Login as Student
1. Run **"Register Student"** - Token auto-saved to `student_token`
2. Run **"Login"** - Token auto-saved to `token`

### Step 2: Create an Admin User (via MongoDB)
To test admin endpoints, manually create an admin user in MongoDB:

```javascript
// Connect to MongoDB and run:
db.users.insertOne({
  name: "Admin User",
  email: "admin@test.com",
  password: "$2a$10$..." // Use bcrypt to hash "admin123"
  role: "Administrator",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Or use the register endpoint and manually change role in database:
```javascript
db.users.updateOne(
  { email: "admin@test.com" },
  { $set: { role: "Administrator" } }
)
```

### Step 3: Login as Admin
1. Run **"Login"** with admin credentials
2. Copy the token from response
3. Manually set `admin_token` in environment variables

### Step 4: Test Endpoints
- Use **student_token** for student endpoints
- Use **admin_token** for admin endpoints

## 📝 Example Requests & Responses

### ✅ Valid Request - Register Student
**Request:**
```json
{
  "name": "John Doe",
  "email": "student@test.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### ❌ Invalid Request - Duplicate Email
**Request:**
```json
{
  "name": "John Doe",
  "email": "student@test.com",
  "password": "password123"
}
```

**Response (409):**
```json
{
  "success": false,
  "message": "User already exists"
}
```

### ❌ Invalid Request - Wrong Password
**Request:**
```json
{
  "email": "student@test.com",
  "password": "wrongpassword"
}
```

**Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

## 🎯 Testing Checklist

### Authentication ✓
- [x] Register new student (valid data)
- [x] Register with duplicate email (error case)
- [x] Login with correct credentials (valid)
- [x] Login with wrong password (error case)
- [x] Get profile with valid token
- [x] Get profile without token (error case)

### Courses ✓
- [x] Get all courses (public)
- [x] Add course as admin (valid)
- [x] Add course as student (error - forbidden)

### Books ✓
- [x] Get all books with pagination
- [x] Get available books only
- [x] Search books by keyword
- [x] Add book as admin (valid)
- [x] Add book without auth (error)

### Students ✓
- [x] Get all students as admin
- [x] Get all students as student (error - forbidden)

### Borrowing ✓
- [x] Issue book as admin (valid)
- [x] Issue unavailable book (error)
- [x] Return book as admin (valid)
- [x] View my borrowed books as student
- [x] View overdue books as admin

### Dashboard ✓
- [x] Get statistics as admin
- [x] Get statistics as student (error - forbidden)

## 🔒 HTTP Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful GET, PUT |
| 201 | Created | Successful POST (register, add) |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Invalid/missing token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate entry |
| 500 | Server Error | Internal error |

## 💡 Tips

1. **Auto-save tokens**: Login and Register requests automatically save tokens to environment
2. **Use environment variables**: All requests use `{{base_url}}` and `{{token}}` variables
3. **Admin testing**: Create admin user in database, then login to get admin_token
4. **Test errors**: Try requests without auth, with wrong IDs, duplicate data, etc.

## 📦 Export Instructions

1. Click on collection name → "..." menu → "Export"
2. Select "Collection v2.1" format
3. Save as `Library-Management-API.postman_collection.json`
4. Export environment: Click environment → "..." → "Export"
5. Save as `Library-Management.postman_environment.json`

---

**Ready to test!** Start with Authentication → Courses → Books → Students → Borrowing → Dashboard

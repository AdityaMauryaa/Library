import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ManageCourses from './pages/ManageCourses'
import ManageBooks from './pages/ManageBooks'
import BookDetails from './pages/BookDetails'
import ManageStudents from './pages/ManageStudents'
import StudentDetails from './pages/StudentDetails'
import MyBorrowedBooks from './pages/MyBorrowedBooks'
import BorrowedBooks from './pages/BorrowedBooks'
import IssueBook from './pages/IssueBook'
import OverdueBooks from './pages/OverdueBooks'
import AdminDashboard from './pages/AdminDashboard'
import StudentDashboard from './pages/StudentDashboard'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Book Routes - Protected for authenticated users */}
        <Route path="/books" element={
          <ProtectedRoute>
            <ManageBooks />
          </ProtectedRoute>
        } />
        <Route path="/books/:id" element={
          <ProtectedRoute>
            <BookDetails />
          </ProtectedRoute>
        } />

        {/* Student Routes - My borrowed books */}
        <Route path="/my-books" element={
          <ProtectedRoute>
            <MyBorrowedBooks />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        
        {/* Admin Only Routes */}
        <Route path="/admin/courses" element={
          <ProtectedRoute requiredRole="Administrator">
            <ManageCourses />
          </ProtectedRoute>
        } />
        <Route path="/admin/students" element={
          <ProtectedRoute requiredRole="Administrator">
            <ManageStudents />
          </ProtectedRoute>
        } />
        <Route path="/admin/students/:id" element={
          <ProtectedRoute requiredRole="Administrator">
            <StudentDetails />
          </ProtectedRoute>
        } />
        <Route path="/admin/borrowed" element={
          <ProtectedRoute requiredRole="Administrator">
            <BorrowedBooks />
          </ProtectedRoute>
        } />
        <Route path="/admin/borrow/issue" element={
          <ProtectedRoute requiredRole="Administrator">
            <IssueBook />
          </ProtectedRoute>
        } />
        <Route path="/admin/overdue" element={
          <ProtectedRoute requiredRole="Administrator">
            <OverdueBooks />
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="Administrator">
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthProvider>
  )
}

export default App

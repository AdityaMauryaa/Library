import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  BarChart3,
  AlertTriangle,
  Library,
  Clock,
  DollarSign,
  GraduationCap,
  LogOut,
  LogIn,
  UserPlus,
  BookMarked,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const adminCards = [
    {
      title: 'Dashboard',
      description: 'View library statistics and reports',
      icon: BarChart3,
      link: '/admin/dashboard',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      title: 'Manage Books',
      description: 'Add, edit, or remove books from the library',
      icon: BookOpen,
      link: '/books',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Manage Students',
      description: 'View and manage registered students',
      icon: Users,
      link: '/admin/students',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Borrowed Books',
      description: 'View and manage all borrowed books',
      icon: BookMarked,
      link: '/admin/borrowed',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Overdue Books',
      description: 'Track overdue books and fines',
      icon: AlertTriangle,
      link: '/admin/overdue',
      color: 'from-red-500 to-red-600',
    },
    {
      title: 'Manage Courses',
      description: 'Add, edit, or remove courses',
      icon: GraduationCap,
      link: '/admin/courses',
      color: 'from-amber-500 to-amber-600',
    },
  ];

  const studentCards = [
    {
      title: 'My Dashboard',
      description: 'View your borrowing stats',
      icon: BarChart3,
      link: '/dashboard',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      title: 'Browse Books',
      description: 'Search and view available books',
      icon: Library,
      link: '/books',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'My Borrowed Books',
      description: 'View your borrowed books and due dates',
      icon: Clock,
      link: '/my-books',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">Library Management</span>
            </Link>

            <div className="flex items-center gap-4">
              {isAuthenticated() ? (
                <>
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-800">{user?.name}</p>
                      <p className="text-gray-500 text-xs">{user?.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/25"
                  >
                    <UserPlus className="w-4 h-4" />
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            Welcome to Library Management System
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isAuthenticated()
              ? `Hello ${user?.name}! What would you like to do today?`
              : 'Manage books, track borrowings, and more.'}
          </p>
        </div>

        {isAuthenticated() ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(isAdmin() ? adminCards : studentCards).map((card) => (
              <Link
                key={card.title}
                to={card.link}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-6">
                  <div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${card.color} mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h3>
                  <p className="text-gray-500">{card.description}</p>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <span className="text-sm font-medium text-purple-600 group-hover:text-purple-700">
                    Go to {card.title} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
              <div className="inline-flex p-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl mb-6">
                <Library className="w-12 h-12 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Get Started Today
              </h2>
              <p className="text-gray-600 mb-8">
                Please login or register to access the library system and start borrowing books.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-purple-600 hover:text-purple-600 transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/25"
                >
                  <UserPlus className="w-5 h-5" />
                  Register as Student
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            © 2026 Library Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

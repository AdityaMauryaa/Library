import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  BookOpen,
  Clock,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Loader2,
  Library,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import borrowService from '../services/borrowService';

const StudentDashboard = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [totalFine, setTotalFine] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      const response = await borrowService.getMyBorrowedBooks();
      setBorrowedBooks(response.data || []);
      setTotalFine(response.totalFine || 0);
    } catch (error) {
      toast.error('Failed to fetch your data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const currentlyBorrowed = borrowedBooks.filter((b) => b.status === 'Borrowed');
  const returnedBooks = borrowedBooks.filter((b) => b.status === 'Returned');
  const overdueBooks = currentlyBorrowed.filter(
    (b) => new Date(b.dueDate) < new Date()
  );

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  };

  const quickActions = [
    {
      title: 'Browse Books',
      description: 'Find and view available books',
      icon: Library,
      link: '/books',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'My Borrowed Books',
      description: 'View your borrowing history',
      icon: BookOpen,
      link: '/my-books',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">My Dashboard</h1>
                <p className="text-sm text-gray-500">Student Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-800">{user?.name}</p>
                  <p className="text-gray-500 text-xs">Student</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Hello, {user?.name}! 👋
          </h2>
          <p className="text-gray-600 mt-1">
            Track your borrowed books and due dates here.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {currentlyBorrowed.length}
                    </p>
                    <p className="text-xs text-gray-600">Borrowed</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {returnedBooks.length}
                    </p>
                    <p className="text-xs text-gray-600">Returned</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {overdueBooks.length}
                    </p>
                    <p className="text-xs text-gray-600">Overdue</p>
                  </div>
                </div>
              </div>

              <div className={`rounded-2xl p-5 ${totalFine > 0 ? 'bg-amber-50' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${totalFine > 0 ? 'bg-amber-100' : 'bg-gray-100'}`}>
                    <DollarSign className={`w-5 h-5 ${totalFine > 0 ? 'text-amber-600' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${totalFine > 0 ? 'text-amber-600' : 'text-gray-600'}`}>
                      ${totalFine}
                    </p>
                    <p className="text-xs text-gray-600">Total Fine</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Currently Borrowed Books */}
            {currentlyBorrowed.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Currently Borrowed
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {currentlyBorrowed.slice(0, 3).map((book) => {
                    const daysRemaining = getDaysRemaining(book.dueDate);
                    const isOverdue = daysRemaining < 0;

                    return (
                      <div key={book._id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <BookOpen className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {book.bookId?.title || 'Unknown'}
                              </p>
                              <p className="text-sm text-gray-500">
                                by {book.bookId?.author || 'Unknown'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                Due: {new Date(book.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                            {isOverdue ? (
                              <span className="text-red-600 text-sm font-medium">
                                {Math.abs(daysRemaining)} days overdue
                              </span>
                            ) : (
                              <span className="text-green-600 text-sm font-medium">
                                {daysRemaining} days remaining
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {currentlyBorrowed.length > 3 && (
                  <div className="p-4 bg-gray-50 text-center">
                    <Link
                      to="/my-books"
                      className="text-purple-600 hover:text-purple-800 font-medium text-sm"
                    >
                      View all {currentlyBorrowed.length} borrowed books →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <Link
                    key={action.title}
                    to={action.link}
                    className="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-r ${action.color} group-hover:scale-110 transition-transform`}
                      >
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mt-4">{action.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Empty State */}
            {borrowedBooks.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No Borrowing History
                </h3>
                <p className="text-gray-400 mb-6">
                  You haven't borrowed any books yet. Start exploring!
                </p>
                <Link
                  to="/books"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all"
                >
                  <Library className="w-5 h-5" />
                  Browse Books
                </Link>
              </div>
            )}
          </>
        )}

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;

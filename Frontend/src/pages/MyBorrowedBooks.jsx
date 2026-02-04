import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Calendar,
  DollarSign,
  Loader2,
  CheckCircle,
  AlertCircle,
  Library,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import borrowService from '../services/borrowService';

const MyBorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalFine, setTotalFine] = useState(0);
  const { user } = useAuth();

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
      toast.error('Failed to fetch borrowed books');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (book) => {
    if (book.status === 'Returned') {
      return {
        label: 'Returned',
        color: 'green',
        icon: CheckCircle,
      };
    }
    const isOverdue = new Date(book.dueDate) < new Date();
    if (isOverdue) {
      return {
        label: 'Overdue',
        color: 'red',
        icon: AlertCircle,
      };
    }
    return {
      label: 'Borrowed',
      color: 'blue',
      icon: Clock,
    };
  };

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const currentlyBorrowed = borrowedBooks.filter((b) => b.status === 'Borrowed');
  const returnedBooks = borrowedBooks.filter((b) => b.status === 'Returned');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
                  <Library className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">My Borrowed Books</h1>
                  <p className="text-sm text-gray-500">Track your borrowed books and due dates</p>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Welcome, <span className="font-medium">{user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{currentlyBorrowed.length}</p>
                <p className="text-sm text-gray-500">Currently Borrowed</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{returnedBooks.length}</p>
                <p className="text-sm text-gray-500">Books Returned</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${totalFine > 0 ? 'bg-red-100' : 'bg-gray-100'}`}>
                <DollarSign className={`w-6 h-6 ${totalFine > 0 ? 'text-red-600' : 'text-gray-600'}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${totalFine > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                  ${totalFine}
                </p>
                <p className="text-sm text-gray-500">Total Fine</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        ) : borrowedBooks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Borrowed Books</h3>
            <p className="text-gray-400 mb-6">You haven't borrowed any books yet.</p>
            <Link
              to="/books"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all"
            >
              <BookOpen className="w-5 h-5" />
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Currently Borrowed */}
            {currentlyBorrowed.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-blue-50">
                  <h2 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Currently Borrowed ({currentlyBorrowed.length})
                  </h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {currentlyBorrowed.map((book) => {
                    const statusInfo = getStatusInfo(book);
                    const daysRemaining = getDaysRemaining(book.dueDate);
                    const StatusIcon = statusInfo.icon;

                    return (
                      <div key={book._id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            <div className="p-3 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl">
                              <BookOpen className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {book.bookId?.title || 'Unknown Book'}
                              </h3>
                              <p className="text-sm text-gray-500">
                                by {book.bookId?.author || 'Unknown Author'}
                              </p>
                              <div className="flex flex-wrap gap-4 mt-2 text-sm">
                                <span className="flex items-center gap-1 text-gray-600">
                                  <Calendar className="w-4 h-4" />
                                  Due: {new Date(book.dueDate).toLocaleDateString()}
                                </span>
                                {statusInfo.color === 'red' ? (
                                  <span className="text-red-600 font-medium">
                                    {Math.abs(daysRemaining)} days overdue
                                  </span>
                                ) : (
                                  <span className="text-green-600 font-medium">
                                    {daysRemaining} days remaining
                                  </span>
                                )}
                                {book.currentFine > 0 && (
                                  <span className="text-red-600 font-medium">
                                    Fine: ${book.currentFine}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                              statusInfo.color === 'red'
                                ? 'bg-red-50 text-red-600'
                                : statusInfo.color === 'blue'
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-green-50 text-green-600'
                            }`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Returned Books */}
            {returnedBooks.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-green-50">
                  <h2 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Returned Books ({returnedBooks.length})
                  </h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {returnedBooks.map((book) => (
                    <div key={book._id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="p-3 bg-gray-100 rounded-xl">
                            <BookOpen className="w-6 h-6 text-gray-500" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {book.bookId?.title || 'Unknown Book'}
                            </h3>
                            <p className="text-sm text-gray-500">
                              by {book.bookId?.author || 'Unknown Author'}
                            </p>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                              <span>
                                Borrowed: {new Date(book.issueDate).toLocaleDateString()}
                              </span>
                              <span>
                                Returned: {new Date(book.returnDate).toLocaleDateString()}
                              </span>
                              {book.fine > 0 && (
                                <span className="text-red-600 font-medium">
                                  Fine Paid: ${book.fine}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                          <CheckCircle className="w-3 h-3" />
                          Returned
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default MyBorrowedBooks;

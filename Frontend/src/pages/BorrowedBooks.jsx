import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Calendar,
  Loader2,
  CheckCircle,
  AlertCircle,
  Filter,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import borrowService from '../services/borrowService';

const BorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returnLoading, setReturnLoading] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const { user } = useAuth();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(10);

  const fetchBorrowedBooks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await borrowService.getAllBorrowed(currentPage, limit, statusFilter);
      setBorrowedBooks(response.data || []);
      setTotalPages(response.pages || 1);
      setTotalRecords(response.total || 0);
    } catch (error) {
      toast.error('Failed to fetch borrowed books');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, statusFilter]);

  useEffect(() => {
    fetchBorrowedBooks();
  }, [fetchBorrowedBooks]);

  const handleReturn = async (transactionId) => {
    if (!window.confirm('Are you sure you want to mark this book as returned?')) return;

    try {
      setReturnLoading(transactionId);
      const response = await borrowService.returnBook(transactionId);
      toast.success(response.message || 'Book returned successfully');
      fetchBorrowedBooks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to return book');
    } finally {
      setReturnLoading(null);
    }
  };

  const handleFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const getStatusBadge = (status, dueDate) => {
    if (status === 'Returned') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
          <CheckCircle className="w-3 h-3" />
          Returned
        </span>
      );
    }
    const isOverdue = new Date(dueDate) < new Date();
    if (isOverdue) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium">
          <AlertCircle className="w-3 h-3" />
          Overdue
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
        <Clock className="w-3 h-3" />
        Borrowed
      </span>
    );
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">All Borrowed Books</h1>
                  <p className="text-sm text-gray-500">Manage all book transactions</p>
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="">All Status</option>
              <option value="Borrowed">Currently Borrowed</option>
              <option value="Returned">Returned</option>
            </select>
          </div>
          <Link
            to="/admin/borrow/issue"
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Issue New Book
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : borrowedBooks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Records Found</h3>
            <p className="text-gray-400">
              {statusFilter ? 'No books match the selected filter' : 'No books have been borrowed yet'}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Book</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Student</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Issue Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Due Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {borrowedBooks.map((record) => (
                      <tr key={record._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-800">{record.bookId?.title || 'Unknown'}</p>
                            <p className="text-sm text-gray-500">{record.bookId?.author}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-gray-800">{record.studentId?.name || 'Unknown'}</p>
                              <p className="text-sm text-gray-500">{record.studentId?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(record.issueDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {new Date(record.dueDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(record.status, record.dueDate)}
                          {record.fine > 0 && (
                            <p className="text-sm text-red-600 mt-1">Fine: ${record.fine}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {record.status === 'Borrowed' && (
                            <button
                              onClick={() => handleReturn(record._id)}
                              disabled={returnLoading === record._id}
                              className="inline-flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-medium disabled:opacity-50"
                            >
                              {returnLoading === record._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <RotateCcw className="w-4 h-4" />
                              )}
                              Return
                            </button>
                          )}
                          {record.status === 'Returned' && record.returnDate && (
                            <span className="text-sm text-gray-500">
                              Returned: {new Date(record.returnDate).toLocaleDateString()}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-indigo-600 text-white'
                              : 'border border-gray-200 hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="px-2 text-gray-400">...</span>;
                    }
                    return null;
                  })}
                </div>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="mt-6 p-4 bg-white rounded-xl border border-gray-100">
              <p className="text-sm text-gray-500 text-center">
                Showing{' '}
                <span className="font-medium text-gray-700">
                  {(currentPage - 1) * limit + 1} - {Math.min(currentPage * limit, totalRecords)}
                </span>{' '}
                of <span className="font-medium text-gray-700">{totalRecords}</span> records
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default BorrowedBooks;

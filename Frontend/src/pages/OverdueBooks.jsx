import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  AlertTriangle,
  Clock,
  Calendar,
  DollarSign,
  Loader2,
  RotateCcw,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import borrowService from '../services/borrowService';

const OverdueBooks = () => {
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returnLoading, setReturnLoading] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchOverdueBooks();
  }, []);

  const fetchOverdueBooks = async () => {
    try {
      setLoading(true);
      const response = await borrowService.getOverdueBooks();
      setOverdueBooks(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch overdue books');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (transactionId) => {
    if (!window.confirm('Are you sure you want to mark this book as returned?')) return;

    try {
      setReturnLoading(transactionId);
      const response = await borrowService.returnBook(transactionId);
      toast.success(response.message || 'Book returned successfully');
      setOverdueBooks((prev) => prev.filter((b) => b._id !== transactionId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to return book');
    } finally {
      setReturnLoading(null);
    }
  };

  const totalFines = overdueBooks.reduce((sum, book) => sum + (book.calculatedFine || 0), 0);

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
                <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Overdue Books</h1>
                  <p className="text-sm text-gray-500">Track and manage overdue returns</p>
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
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{overdueBooks.length}</p>
                <p className="text-sm text-gray-500">Overdue Books</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">${totalFines}</p>
                <p className="text-sm text-gray-500">Total Pending Fines</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
          </div>
        ) : overdueBooks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="p-4 bg-green-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Overdue Books!</h3>
            <p className="text-gray-400">All books have been returned on time. Great job!</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-red-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Book</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Student</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Due Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Days Overdue</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Fine</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {overdueBooks.map((record) => (
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
                          {new Date(record.dueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-red-500" />
                          <span className="text-red-600 font-semibold">
                            {record.daysOverdue} days
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-red-600 font-bold text-lg">
                          ${record.calculatedFine}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleReturn(record._id)}
                          disabled={returnLoading === record._id}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors font-medium disabled:opacity-50"
                        >
                          {returnLoading === record._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <RotateCcw className="w-4 h-4" />
                          )}
                          Return & Collect Fine
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Fine is calculated at $2 per day after the due date. 
            The fine amount shown is based on the current date and will increase each day until the book is returned.
          </p>
        </div>
      </main>
    </div>
  );
};

export default OverdueBooks;

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  BookOpen,
  User,
  Hash,
  Layers,
  Calendar,
  Edit2,
  Trash2,
  Loader2,
  BookMarked,
  CheckCircle,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import bookService from '../services/bookService';
import courseService from '../services/courseService';
import BookFormModal from '../components/BookFormModal';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [book, setBook] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchBook();
    fetchCourses();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await bookService.getBookById(id);
      setBook(response.data);
    } catch (error) {
      toast.error('Failed to fetch book details');
      console.error(error);
      navigate('/books');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await courseService.getAllCourses();
      setCourses(response.data || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(true);
      await bookService.deleteBook(id);
      toast.success('Book deleted successfully');
      navigate('/books');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete book');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      const response = await bookService.updateBook(id, formData);
      setBook(response.data);
      toast.success('Book updated successfully');
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update book');
    } finally {
      setFormLoading(false);
    }
  };

  // Get availability status
  const getAvailabilityStatus = (book) => {
    if (!book) return { text: 'Unknown', color: 'gray', icon: AlertCircle };
    const ratio = book.availableQty / book.quantity;
    if (ratio === 0) return { text: 'Out of Stock', color: 'red', icon: XCircle };
    if (ratio <= 0.3) return { text: 'Low Stock', color: 'orange', icon: AlertCircle };
    return { text: 'Available', color: 'green', icon: CheckCircle };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-600 mb-2">Book Not Found</h2>
          <p className="text-gray-400 mb-4">The book you're looking for doesn't exist.</p>
          <Link
            to="/books"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  const status = getAvailabilityStatus(book);
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/books"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl">
                  <BookMarked className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Book Details</h1>
                  <p className="text-sm text-gray-500">View book information</p>
                </div>
              </div>
            </div>
            
            {isAdmin() && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium disabled:opacity-50"
                >
                  {deleteLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Book Header */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="p-6 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl">
                <BookOpen className="w-16 h-16 text-emerald-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {book.title}
                    </h2>
                    <p className="text-lg text-gray-500">by {book.author}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium ${
                      status.color === 'green'
                        ? 'bg-green-50 text-green-600'
                        : status.color === 'orange'
                        ? 'bg-orange-50 text-orange-600'
                        : status.color === 'red'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-gray-50 text-gray-600'
                    }`}
                  >
                    <StatusIcon className="w-4 h-4" />
                    {status.text}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="p-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Book Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ISBN */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <Hash className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">ISBN</p>
                  <p className="font-mono text-gray-800">{book.ISBN}</p>
                </div>
              </div>

              {/* Author */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Author</p>
                  <p className="text-gray-800">{book.author}</p>
                </div>
              </div>

              {/* Course */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <BookMarked className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Course</p>
                  <p className="text-gray-800">
                    {book.course?.courseName || 'N/A'}
                    {book.course?.courseCode && (
                      <span className="ml-2 text-sm text-gray-500">
                        ({book.course.courseCode})
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <Layers className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Stock</p>
                  <p className="text-gray-800">
                    <span className="font-bold text-emerald-600">{book.availableQty}</span>
                    <span className="text-gray-400"> / </span>
                    <span>{book.quantity}</span>
                    <span className="text-sm text-gray-500 ml-2">copies available</span>
                  </p>
                </div>
              </div>

              {/* Created Date */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <Calendar className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Added On</p>
                  <p className="text-gray-800">
                    {new Date(book.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Last Updated */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <Calendar className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                  <p className="text-gray-800">
                    {new Date(book.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Availability Bar */}
            <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-700">Availability</span>
                <span className="text-sm text-gray-500">
                  {Math.round((book.availableQty / book.quantity) * 100)}% in stock
                </span>
              </div>
              <div className="w-full h-3 bg-white rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full rounded-full transition-all ${
                    status.color === 'green'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      : status.color === 'orange'
                      ? 'bg-gradient-to-r from-orange-400 to-amber-400'
                      : 'bg-gradient-to-r from-red-400 to-rose-400'
                  }`}
                  style={{
                    width: `${(book.availableQty / book.quantity) * 100}%`,
                  }}
                />
              </div>
              <p className="mt-3 text-sm text-gray-600">
                {book.availableQty === 0 ? (
                  <span className="text-red-600">
                    All copies are currently borrowed. Please check back later.
                  </span>
                ) : book.availableQty === book.quantity ? (
                  <span className="text-emerald-600">
                    All copies are available for borrowing.
                  </span>
                ) : (
                  <span>
                    {book.quantity - book.availableQty} out of {book.quantity} copies are currently borrowed.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <Link
            to="/books"
            className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Book List
          </Link>
        </div>
      </main>

      {/* Edit Modal */}
      <BookFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        book={book}
        courses={courses}
        loading={formLoading}
      />
    </div>
  );
};

export default BookDetails;

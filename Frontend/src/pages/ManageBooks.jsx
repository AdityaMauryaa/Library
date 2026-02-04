import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  BookOpen,
  ArrowLeft,
  Loader2,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  BookMarked,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import bookService from '../services/bookService';
import courseService from '../services/courseService';
import BookFormModal from '../components/BookFormModal';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [limit] = useState(9);

  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Fetch books with pagination
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setSearchMode(false);
      const response = await bookService.getAllBooks(currentPage, limit, selectedCourse);
      setBooks(response.data || []);
      setTotalPages(response.pages || 1);
      setTotalBooks(response.total || 0);
    } catch (error) {
      toast.error('Failed to fetch books');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, selectedCourse]);

  // Fetch courses for filter dropdown and form
  const fetchCourses = async () => {
    try {
      const response = await courseService.getAllCourses();
      setCourses(response.data || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      fetchBooks();
    }
  }, [fetchBooks, searchQuery]);

  // Search books
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchBooks();
      return;
    }
    
    try {
      setLoading(true);
      setSearchMode(true);
      const response = await bookService.searchBooks(searchQuery);
      setBooks(response.data || []);
      setTotalPages(1);
      setTotalBooks(response.count || 0);
    } catch (error) {
      toast.error('Search failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search on Enter key
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchMode(false);
    setCurrentPage(1);
  };

  // Handle course filter change
  const handleCourseFilter = (courseId) => {
    setSelectedCourse(courseId);
    setCurrentPage(1);
    setSearchQuery('');
    setSearchMode(false);
  };

  // Pagination handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddBook = () => {
    setSelectedBook(null);
    setIsModalOpen(true);
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleViewBook = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      setDeleteLoading(bookId);
      await bookService.deleteBook(bookId);
      setBooks((prev) => prev.filter((b) => b._id !== bookId));
      setTotalBooks((prev) => prev - 1);
      toast.success('Book deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete book');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      if (selectedBook) {
        // Update existing book
        const response = await bookService.updateBook(selectedBook._id, formData);
        setBooks((prev) =>
          prev.map((b) => (b._id === selectedBook._id ? response.data : b))
        );
        toast.success('Book updated successfully');
      } else {
        // Create new book
        await bookService.createBook(formData);
        toast.success('Book created successfully');
        // Refresh the list to show the new book
        fetchBooks();
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save book');
    } finally {
      setFormLoading(false);
    }
  };

  // Get availability status
  const getAvailabilityStatus = (book) => {
    const ratio = book.availableQty / book.quantity;
    if (ratio === 0) return { text: 'Out of Stock', color: 'red' };
    if (ratio <= 0.3) return { text: 'Low Stock', color: 'orange' };
    return { text: 'Available', color: 'green' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl">
                  <BookMarked className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">
                    {isAdmin() ? 'Book Management' : 'Browse Books'}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {isAdmin() ? 'Manage all books in the library' : 'Find and borrow books'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{user?.name}</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Course Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedCourse}
                onChange={(e) => handleCourseFilter(e.target.value)}
                className="pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none cursor-pointer min-w-[180px]"
              >
                <option value="">All Courses</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.courseName}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
            >
              Search
            </button>

            {/* Add Book Button (Admin only) */}
            {isAdmin() && (
              <button
                onClick={handleAddBook}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/25"
              >
                <Plus className="w-5 h-5" />
                Add Book
              </button>
            )}
          </div>
        </div>

        {/* Search Mode Indicator */}
        {searchMode && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
            <span className="text-emerald-700">
              Search results for "<strong>{searchQuery}</strong>" - {totalBooks} book(s) found
            </span>
            <button
              onClick={clearSearch}
              className="text-emerald-600 hover:text-emerald-800 font-medium"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Books Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {searchQuery ? 'No books found' : 'No books yet'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery
                ? 'Try a different search term or filter'
                : 'Start by adding your first book'}
            </p>
            {!searchQuery && isAdmin() && (
              <button
                onClick={handleAddBook}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-teal-700 transition-all"
              >
                <Plus className="w-5 h-5" />
                Add First Book
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => {
                const status = getAvailabilityStatus(book);
                return (
                  <div
                    key={book._id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl">
                          <BookOpen className="w-6 h-6 text-emerald-600" />
                        </div>
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full ${
                            status.color === 'green'
                              ? 'bg-green-50 text-green-600'
                              : status.color === 'orange'
                              ? 'bg-orange-50 text-orange-600'
                              : 'bg-red-50 text-red-600'
                          }`}
                        >
                          {status.text}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">
                        {book.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-3">by {book.author}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">ISBN:</span>
                          <span className="text-gray-600 font-mono">{book.ISBN}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Course:</span>
                          <span className="text-gray-600">
                            {book.course?.courseCode || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Available:</span>
                          <span className="text-gray-600 font-medium">
                            {book.availableQty} / {book.quantity}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleViewBook(book._id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        {isAdmin() && (
                          <>
                            <button
                              onClick={() => handleEditBook(book)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors font-medium"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteBook(book._id)}
                              disabled={deleteLoading === book._id}
                              className="flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium disabled:opacity-50"
                            >
                              {deleteLoading === book._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {!searchMode && totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
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
                    // Show first, last, current, and adjacent pages
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
                              ? 'bg-emerald-600 text-white'
                              : 'border border-gray-200 hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    // Show ellipsis
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-2 text-gray-400">
                          ...
                        </span>
                      );
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
          </>
        )}

        {/* Stats */}
        {!loading && books.length > 0 && (
          <div className="mt-8 p-4 bg-white rounded-xl border border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              {searchMode ? (
                <>
                  Found <span className="font-medium text-gray-700">{totalBooks}</span> book(s)
                </>
              ) : (
                <>
                  Showing{' '}
                  <span className="font-medium text-gray-700">
                    {(currentPage - 1) * limit + 1} - {Math.min(currentPage * limit, totalBooks)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium text-gray-700">{totalBooks}</span> books
                </>
              )}
            </p>
          </div>
        )}
      </main>

      {/* Book Form Modal */}
      <BookFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        book={selectedBook}
        courses={courses}
        loading={formLoading}
      />
    </div>
  );
};

export default ManageBooks;

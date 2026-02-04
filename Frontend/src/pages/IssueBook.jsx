import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  BookOpen,
  User,
  Search,
  Loader2,
  CheckCircle,
  BookPlus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import borrowService from '../services/borrowService';
import studentService from '../services/studentService';
import bookService from '../services/bookService';

const IssueBook = () => {
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issueLoading, setIssueLoading] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, booksRes] = await Promise.all([
        studentService.getAllStudents(1, 100),
        bookService.getAvailableBooks(),
      ]);
      setStudents(studentsRes.data || []);
      setBooks(booksRes.data || []);
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleIssue = async () => {
    if (!selectedStudent || !selectedBook) {
      toast.error('Please select both a student and a book');
      return;
    }

    try {
      setIssueLoading(true);
      await borrowService.issueBook(selectedStudent._id, selectedBook._id);
      toast.success('Book issued successfully!');
      navigate('/admin/borrowed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to issue book');
    } finally {
      setIssueLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email?.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredBooks = books.filter(
    (b) =>
      b.title?.toLowerCase().includes(bookSearch.toLowerCase()) ||
      b.author?.toLowerCase().includes(bookSearch.toLowerCase()) ||
      b.ISBN?.toLowerCase().includes(bookSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/admin/borrowed"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                  <BookPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Issue Book</h1>
                  <p className="text-sm text-gray-500">Issue a book to a student</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Select Student */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-green-50">
              <h2 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                <User className="w-5 h-5" />
                Select Student
              </h2>
            </div>
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {filteredStudents.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No students found</p>
                ) : (
                  filteredStudents.map((student) => (
                    <div
                      key={student._id}
                      onClick={() => setSelectedStudent(student)}
                      className={`p-3 rounded-xl cursor-pointer transition-all ${
                        selectedStudent?._id === student._id
                          ? 'bg-green-100 border-2 border-green-500'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {student.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                        {selectedStudent?._id === student._id && (
                          <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Select Book */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-indigo-50">
              <h2 className="text-lg font-semibold text-indigo-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Select Book
              </h2>
            </div>
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search books..."
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {filteredBooks.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No available books found</p>
                ) : (
                  filteredBooks.map((book) => (
                    <div
                      key={book._id}
                      onClick={() => setSelectedBook(book)}
                      className={`p-3 rounded-xl cursor-pointer transition-all ${
                        selectedBook?._id === book._id
                          ? 'bg-indigo-100 border-2 border-indigo-500'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate">{book.title}</p>
                          <p className="text-sm text-gray-500">{book.author}</p>
                          <p className="text-xs text-gray-400">
                            Available: {book.availableQty} / {book.quantity}
                          </p>
                        </div>
                        {selectedBook?._id === book._id && (
                          <CheckCircle className="w-5 h-5 text-indigo-600" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Summary */}
        {(selectedStudent || selectedBook) && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Issue Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Student</p>
                {selectedStudent ? (
                  <p className="font-medium text-gray-800">{selectedStudent.name}</p>
                ) : (
                  <p className="text-gray-400 italic">Not selected</p>
                )}
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Book</p>
                {selectedBook ? (
                  <p className="font-medium text-gray-800">{selectedBook.title}</p>
                ) : (
                  <p className="text-gray-400 italic">Not selected</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => {
                  setSelectedStudent(null);
                  setSelectedBook(null);
                }}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Clear Selection
              </button>
              <button
                onClick={handleIssue}
                disabled={!selectedStudent || !selectedBook || issueLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {issueLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Issuing...
                  </span>
                ) : (
                  'Issue Book'
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default IssueBook;

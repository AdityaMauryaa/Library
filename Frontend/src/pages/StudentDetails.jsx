import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  BookOpen,
  Edit2,
  Trash2,
  Loader2,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import studentService from '../services/studentService';
import StudentFormModal from '../components/StudentFormModal';

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [student, setStudent] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const [studentRes, booksRes] = await Promise.all([
        studentService.getStudentById(id),
        studentService.getStudentBorrowedBooks(id),
      ]);
      setStudent(studentRes.data);
      setBorrowedBooks(booksRes.data || []);
    } catch (error) {
      toast.error('Failed to fetch student details');
      console.error(error);
      navigate('/admin/students');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(true);
      await studentService.deleteStudent(id);
      toast.success('Student deleted successfully');
      navigate('/admin/students');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete student');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      const response = await studentService.updateStudent(id, formData);
      setStudent((prev) => ({ ...prev, ...response.data }));
      toast.success('Student updated successfully');
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update student');
    } finally {
      setFormLoading(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-600 mb-2">Student Not Found</h2>
          <p className="text-gray-400 mb-4">The student you're looking for doesn't exist.</p>
          <Link
            to="/admin/students"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Students
          </Link>
        </div>
      </div>
    );
  }

  const currentlyBorrowed = borrowedBooks.filter((b) => b.status === 'Borrowed').length;
  const totalReturned = borrowedBooks.filter((b) => b.status === 'Returned').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/admin/students"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Student Details</h1>
                  <p className="text-sm text-gray-500">View student information</p>
                </div>
              </div>
            </div>

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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Student Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {student.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {student.name}
                </h2>
                <div className="flex flex-wrap gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {student.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Joined {new Date(student.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="p-4 bg-blue-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-blue-600">{currentlyBorrowed}</p>
                <p className="text-sm text-blue-600">Currently Borrowed</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-green-600">{totalReturned}</p>
                <p className="text-sm text-green-600">Returned</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-purple-600">{borrowedBooks.length}</p>
                <p className="text-sm text-purple-600">Total Borrowed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Borrowing History */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              Borrowing History
            </h3>
          </div>

          {borrowedBooks.length === 0 ? (
            <div className="p-8 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No borrowing history yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {borrowedBooks.map((record) => (
                <div key={record._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {record.bookId?.title || 'Unknown Book'}
                      </h4>
                      <p className="text-sm text-gray-500">
                        by {record.bookId?.author || 'Unknown Author'}
                      </p>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                        <span>
                          Issued: {new Date(record.issueDate).toLocaleDateString()}
                        </span>
                        <span>
                          Due: {new Date(record.dueDate).toLocaleDateString()}
                        </span>
                        {record.returnDate && (
                          <span>
                            Returned: {new Date(record.returnDate).toLocaleDateString()}
                          </span>
                        )}
                        {record.fine > 0 && (
                          <span className="text-red-600 font-medium">
                            Fine: ${record.fine}
                          </span>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(record.status, record.dueDate)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <Link
            to="/admin/students"
            className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Student List
          </Link>
        </div>
      </main>

      {/* Edit Modal */}
      <StudentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        student={student}
        loading={formLoading}
      />
    </div>
  );
};

export default StudentDetails;

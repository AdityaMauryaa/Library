import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Search,
  Edit2,
  Trash2,
  ArrowLeft,
  Loader2,
  Users,
  Eye,
  ChevronLeft,
  ChevronRight,
  Mail,
  Calendar,
  BookOpen,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import studentService from '../services/studentService';
import StudentFormModal from '../components/StudentFormModal';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [limit] = useState(10);

  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await studentService.getAllStudents(currentPage, limit);
      setStudents(response.data || []);
      setTotalPages(response.pages || 1);
      setTotalStudents(response.total || 0);
    } catch (error) {
      toast.error('Failed to fetch students');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleViewStudent = (studentId) => {
    navigate(`/admin/students/${studentId}`);
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      setDeleteLoading(studentId);
      await studentService.deleteStudent(studentId);
      setStudents((prev) => prev.filter((s) => s._id !== studentId));
      setTotalStudents((prev) => prev - 1);
      toast.success('Student deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete student');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      const response = await studentService.updateStudent(selectedStudent._id, formData);
      setStudents((prev) =>
        prev.map((s) => (s._id === selectedStudent._id ? { ...s, ...response.data } : s))
      );
      toast.success('Student updated successfully');
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update student');
    } finally {
      setFormLoading(false);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">
                    Student Management
                  </h1>
                  <p className="text-sm text-gray-500">
                    Manage all registered students
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
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Students Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {searchQuery ? 'No students found' : 'No students registered yet'}
            </h3>
            <p className="text-gray-400">
              {searchQuery ? 'Try a different search term' : 'Students will appear here once they register'}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                        Student
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredStudents.map((student) => (
                      <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {student.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-medium text-gray-800">
                              {student.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {student.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(student.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewStudent(student._id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditStudent(student)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Student"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student._id)}
                              disabled={deleteLoading === student._id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete Student"
                            >
                              {deleteLoading === student._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
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
                              ? 'bg-green-600 text-white'
                              : 'border border-gray-200 hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
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
        {!loading && students.length > 0 && (
          <div className="mt-6 p-4 bg-white rounded-xl border border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              Showing{' '}
              <span className="font-medium text-gray-700">
                {(currentPage - 1) * limit + 1} - {Math.min(currentPage * limit, totalStudents)}
              </span>{' '}
              of{' '}
              <span className="font-medium text-gray-700">{totalStudents}</span> students
            </p>
          </div>
        )}
      </main>

      {/* Edit Student Modal */}
      <StudentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        student={selectedStudent}
        loading={formLoading}
      />
    </div>
  );
};

export default ManageStudents;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  BookOpen,
  ArrowLeft,
  GraduationCap,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import courseService from '../services/courseService';
import CourseFormModal from '../components/CourseFormModal';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseService.getAllCourses();
      setCourses(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch courses');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      setDeleteLoading(courseId);
      await courseService.deleteCourse(courseId);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
      toast.success('Course deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete course');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      if (selectedCourse) {
        // Update existing course
        const response = await courseService.updateCourse(
          selectedCourse._id,
          formData
        );
        setCourses((prev) =>
          prev.map((c) => (c._id === selectedCourse._id ? response.data : c))
        );
        toast.success('Course updated successfully');
      } else {
        // Create new course
        const response = await courseService.createCourse(formData);
        setCourses((prev) => [...prev, response.data]);
        toast.success('Course created successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save course');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.courseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.courseCode?.toLowerCase().includes(searchQuery.toLowerCase())
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
                <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">
                    Course Management
                  </h1>
                  <p className="text-sm text-gray-500">
                    Manage all courses in the library system
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
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            onClick={handleAddCourse}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/25"
          >
            <Plus className="w-5 h-5" />
            Add Course
          </button>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {searchQuery ? 'No courses found' : 'No courses yet'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery
                ? 'Try a different search term'
                : 'Start by adding your first course'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleAddCourse}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all"
              >
                <Plus className="w-5 h-5" />
                Add First Course
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl">
                      <BookOpen className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-full">
                      {course.courseCode}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {course.courseName}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                    {course.description || 'No description available'}
                  </p>
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEditCourse(course)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-xl transition-colors font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      disabled={deleteLoading === course._id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium disabled:opacity-50"
                    >
                      {deleteLoading === course._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {!loading && courses.length > 0 && (
          <div className="mt-8 p-4 bg-white rounded-xl border border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              Showing{' '}
              <span className="font-medium text-gray-700">
                {filteredCourses.length}
              </span>{' '}
              of{' '}
              <span className="font-medium text-gray-700">{courses.length}</span>{' '}
              courses
            </p>
          </div>
        )}
      </main>

      {/* Course Form Modal */}
      <CourseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        course={selectedCourse}
        loading={formLoading}
      />
    </div>
  );
};

export default ManageCourses;

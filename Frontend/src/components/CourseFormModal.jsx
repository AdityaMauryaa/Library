import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CourseFormModal = ({ isOpen, onClose, onSubmit, course, loading }) => {
  const [formData, setFormData] = useState({
    courseName: '',
    courseCode: '',
    description: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (course) {
      setFormData({
        courseName: course.courseName || '',
        courseCode: course.courseCode || '',
        description: course.description || '',
      });
    } else {
      setFormData({ courseName: '', courseCode: '', description: '' });
    }
    setErrors({});
  }, [course, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.courseName.trim()) {
      newErrors.courseName = 'Course name is required';
    }
    if (!formData.courseCode.trim()) {
      newErrors.courseCode = 'Course code is required';
    } else if (formData.courseCode.length < 2) {
      newErrors.courseCode = 'Course code must be at least 2 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {course ? '✏️ Edit Course' : '➕ Add New Course'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Name *
            </label>
            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              placeholder="e.g., Computer Science"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.courseName
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-purple-500'
              } focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
            />
            {errors.courseName && (
              <p className="mt-1 text-sm text-red-500">{errors.courseName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Code *
            </label>
            <input
              type="text"
              name="courseCode"
              value={formData.courseCode}
              onChange={handleChange}
              placeholder="e.g., CS101"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.courseCode
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-purple-500'
              } focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
            />
            {errors.courseCode && (
              <p className="mt-1 text-sm text-red-500">{errors.courseCode}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the course..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : course ? (
                'Update Course'
              ) : (
                'Add Course'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseFormModal;

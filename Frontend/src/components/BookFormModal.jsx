import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const BookFormModal = ({ isOpen, onClose, onSubmit, book, courses, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    ISBN: '',
    course: '',
    quantity: 1,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        ISBN: book.ISBN || '',
        course: book.course?._id || book.course || '',
        quantity: book.quantity || 1,
      });
    } else {
      setFormData({
        title: '',
        author: '',
        ISBN: '',
        course: '',
        quantity: 1,
      });
    }
    setErrors({});
  }, [book, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Book title is required';
    }
    if (!formData.author.trim()) {
      newErrors.author = 'Author name is required';
    }
    if (!formData.ISBN.trim()) {
      newErrors.ISBN = 'ISBN is required';
    } else if (formData.ISBN.length < 10) {
      newErrors.ISBN = 'ISBN must be at least 10 characters';
    }
    if (!formData.course) {
      newErrors.course = 'Please select a course';
    }
    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value,
    }));
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800">
            {book ? '✏️ Edit Book' : '📚 Add New Book'}
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
              Book Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Introduction to Algorithms"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.title
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-emerald-500'
              } focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author *
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="e.g., Thomas H. Cormen"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.author
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-emerald-500'
              } focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
            />
            {errors.author && (
              <p className="mt-1 text-sm text-red-500">{errors.author}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ISBN *
            </label>
            <input
              type="text"
              name="ISBN"
              value={formData.ISBN}
              onChange={handleChange}
              placeholder="e.g., 978-0262033848"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.ISBN
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-emerald-500'
              } focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
            />
            {errors.ISBN && (
              <p className="mt-1 text-sm text-red-500">{errors.ISBN}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course *
            </label>
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.course
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-emerald-500'
              } focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-white`}
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.courseName} ({course.courseCode})
                </option>
              ))}
            </select>
            {errors.course && (
              <p className="mt-1 text-sm text-red-500">{errors.course}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity *
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              placeholder="Number of copies"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.quantity
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-emerald-500'
              } focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
            )}
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
              className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
              ) : book ? (
                'Update Book'
              ) : (
                'Add Book'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookFormModal;

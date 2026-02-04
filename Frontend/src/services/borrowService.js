import api from './api';

const borrowService = {
  // Issue book to student (Admin only)
  issueBook: async (studentId, bookId) => {
    const response = await api.post('/borrow', { studentId, bookId });
    return response.data;
  },

  // Return a book (Admin only)
  returnBook: async (transactionId) => {
    const response = await api.post(`/return/${transactionId}`);
    return response.data;
  },

  // Get all borrowed books (Admin only)
  getAllBorrowed: async (page = 1, limit = 10, status = '') => {
    const params = new URLSearchParams({ page, limit });
    if (status) params.append('status', status);
    const response = await api.get(`/borrowed?${params.toString()}`);
    return response.data;
  },

  // Get current user's borrowed books (Student)
  getMyBorrowedBooks: async () => {
    const response = await api.get('/borrowed/my-books');
    return response.data;
  },

  // Get overdue books list (Admin only)
  getOverdueBooks: async () => {
    const response = await api.get('/borrowed/overdue');
    return response.data;
  },
};

export default borrowService;

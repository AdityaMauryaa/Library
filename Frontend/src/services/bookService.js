import api from './api';

const bookService = {
  // Get all books with pagination
  getAllBooks: async (page = 1, limit = 10, course = '') => {
    const params = new URLSearchParams({ page, limit });
    if (course) params.append('course', course);
    const response = await api.get(`/books?${params.toString()}`);
    return response.data;
  },

  // Get available books only
  getAvailableBooks: async (course = '') => {
    const params = course ? `?course=${course}` : '';
    const response = await api.get(`/books/available${params}`);
    return response.data;
  },

  // Get single book by ID
  getBookById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  // Search books by title or author
  searchBooks: async (query) => {
    const response = await api.get(`/books/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Create new book (Admin only)
  createBook: async (bookData) => {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  // Update book (Admin only)
  updateBook: async (id, bookData) => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  // Delete book (Admin only)
  deleteBook: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },
};

export default bookService;

import api from './api';

const studentService = {
  // Get all students with pagination (Admin only)
  getAllStudents: async (page = 1, limit = 10) => {
    const response = await api.get(`/students?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get single student by ID (Admin only)
  getStudentById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  // Update student info (Admin only)
  updateStudent: async (id, studentData) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
  },

  // Delete student (Admin only)
  deleteStudent: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },

  // Get student's borrowed books
  getStudentBorrowedBooks: async (id) => {
    const response = await api.get(`/students/${id}/borrowed-books`);
    return response.data;
  },
};

export default studentService;

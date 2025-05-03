import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Add authentication token to all requests
const getAuthToken = () => {
  return localStorage.getItem('token');
};

const authHeaders = () => ({
  headers: {
    'Authorization': `Bearer ${getAuthToken()}`
  }
});

export const QuestionService = {
  // Post a new question (Not available for Admin)
  postQuestion: async (title, description) => {
    try {
      // Get userType from localStorage to implement client-side validation
      const userType = localStorage.getItem('userType');
      
      // Block only Admin from posting questions (client-side validation)
      // Allow Co-Main Station to post questions
      if (userType === 'Admin') {
        throw new Error('Admins cannot post questions');
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/questions`, 
        { title, description },
        authHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all questions (based on user permissions)
  getAllQuestions: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/questions`,
        authHeaders()
      );
      return response.data.questions;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get a single question by ID
  getQuestionById: async (questionId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/questions/${questionId}`,
        authHeaders()
      );
      return response.data.question;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Answer a question (Admin and Co-Main Station only)
  answerQuestion: async (questionId, answer) => {
    try {
      // Get userType from localStorage to implement client-side validation
      const userType = localStorage.getItem('userType');
      
      // Block users other than Admin and Co-Main Station (client-side validation)
      if (userType !== 'Admin' && userType !== 'Co-Main Station') {
        throw new Error('Only Admin and Co-Main Station can answer questions');
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/questions/${questionId}/answer`,
        { answer },
        authHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Close a question (Admin or question creator only)
  closeQuestion: async (questionId) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/questions/${questionId}/close`,
        {},
        authHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default QuestionService;

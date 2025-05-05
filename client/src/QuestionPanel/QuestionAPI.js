import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';


const getAuthToken = () => {
  return localStorage.getItem('token');
};

const authHeaders = () => ({
  headers: {
    'Authorization': `Bearer ${getAuthToken()}`
  }
});

export const QuestionService = {
  
  postQuestion: async (title, description) => {
    try {
      
      const userType = localStorage.getItem('userType');
      
     
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

 
  answerQuestion: async (questionId, answer) => {
    try {
      
      const userType = localStorage.getItem('userType');
      
      
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

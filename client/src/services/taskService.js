import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Task submission
export const submitTask = async (taskId, submissionData) => {
  try {
    const response = await api.post(`/tasks/${taskId}/submit`, submissionData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to submit task');
  }
};

// Get task details
export const getTaskDetails = async (taskId) => {
  try {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch task details');
  }
};

// Get all tasks for an internship
export const getInternshipTasks = async (internshipId) => {
  try {
    const response = await api.get(`/internships/${internshipId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch internship tasks');
  }
};

// Update task status
export const updateTaskStatus = async (taskId, status, feedback = '') => {
  try {
    const response = await api.patch(`/tasks/${taskId}/status`, {
      status,
      feedback
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update task status');
  }
};

// Get task statistics
export const getTaskStats = async (internshipId) => {
  try {
    const response = await api.get(`/tasks/stats/${internshipId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch task statistics');
  }
};

// Fetch all submissions for an internship
export const getTaskSubmissions = async (internshipId) => {
  try {
    const response = await api.get(`/tasks/task-submissions/${internshipId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch task submissions');
  }
};

// Submit a link for a specific task
export const submitTaskSubmission = async (internshipId, taskNumber, submissionURL) => {
  try {
    const response = await api.post(`/tasks/task-submissions/${internshipId}/${taskNumber}`, { submissionURL });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to submit task');
  }
};

export default {
  submitTask,
  getTaskDetails,
  getInternshipTasks,
  updateTaskStatus,
  getTaskStats,
  getTaskSubmissions,
  submitTaskSubmission,
}; 
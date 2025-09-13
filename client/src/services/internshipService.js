import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Internship Service
const internshipService = {
  // Get all internships for current user
  async getInternships() {
    try {
      const response = await api.get('/internships');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch internships' };
    }
  },

  // Get specific internship with tasks
  async getInternship(internshipId) {
    try {
      const response = await api.get(`/internships/${internshipId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch internship' };
    }
  },

  // Register for new domain
  async registerDomain(domain) {
    try {
      const response = await api.post('/internships/register-domain', { domain });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to register for domain' };
    }
  },

  // Get available domains
  async getAvailableDomains() {
    try {
      const response = await api.get('/internships/available-domains');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch available domains' };
    }
  },

  // Update internship status
  async updateStatus(internshipId, status) {
    try {
      const response = await api.patch(`/internships/${internshipId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update status' };
    }
  },

  // Get internship progress
  async getProgress(internshipId) {
    try {
      const response = await api.get(`/internships/${internshipId}/progress`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch progress' };
    }
  }
};

export default internshipService; 
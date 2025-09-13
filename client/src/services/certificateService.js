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

// Generate certificate for an internship
export const generateCertificate = async (internshipId) => {
  try {
    const response = await api.post(`/certificates/generate/${internshipId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to generate certificate');
  }
};

// Get certificate details
export const getCertificateDetails = async (internshipId) => {
  try {
    const response = await api.get(`/certificates/${internshipId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch certificate details');
  }
};

// Download certificate
export const downloadCertificate = async (certificateNumber) => {
  try {
    const response = await api.get(`/certificates/download/${certificateNumber}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to download certificate');
  }
};

// Get all certificates for a student
export const getAllCertificates = async () => {
  try {
    const response = await api.get('/certificates');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch certificates');
  }
};

// Verify certificate
export const verifyCertificate = async (certificateNumber) => {
  try {
    const response = await api.get(`/certificates/verify/${certificateNumber}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to verify certificate');
  }
};

// Get certificate eligibility status
export const getCertificateEligibility = async (internshipId) => {
  try {
    const response = await api.get(`/certificates/eligibility/${internshipId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to check certificate eligibility');
  }
};

export default {
  generateCertificate,
  getCertificateDetails,
  downloadCertificate,
  getAllCertificates,
  verifyCertificate,
  getCertificateEligibility,
}; 
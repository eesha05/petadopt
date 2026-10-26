import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pet_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';
    if (error.response) {
      if (typeof error.response.data?.detail === 'string') {
        message = error.response.data.detail;
      } else if (Array.isArray(error.response.data?.detail)) {
        message = error.response.data.detail.map((d) => d.msg || d.message).join(', ');
      } else if (error.response.status === 401) {
        message = 'Invalid credentials or session expired. Please log in.';
      } else if (error.response.status === 403) {
        message = 'You do not have permission to perform this action.';
      } else if (error.response.status === 404) {
        message = 'Requested resource not found.';
      }
    } else if (error.request) {
      message = 'Cannot connect to server. Please verify the backend is running.';
    }
    return Promise.reject(new Error(message));
  }
);

export default api;

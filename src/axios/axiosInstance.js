import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Base URL for your API
});

// Request interceptor to add token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response, // Return response if successful
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      
    
      window.location.href = '/login'; // Replace with your actual login route
    }
    return Promise.reject(error); // Propagate error for further handling if needed
  }
);

export default axiosInstance;

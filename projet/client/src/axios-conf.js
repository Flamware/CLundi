import axios from 'axios';

// Set the base URL globally for Axios
axios.defaults.baseURL = 'http://localhost:3000/api/';  // Update to your actual HTTPS URL

// Include credentials
axios.defaults.withCredentials = true;

// Ignore SSL verification (for development purposes only)
axios.interceptors.request.use((config) => {
    return config;
});

export default axios;

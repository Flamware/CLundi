import axios from 'axios';

// Set the base URL conditionally based on the protocol
const baseURL = window.location.protocol === 'https:'
    ? 'https://clundi.fr/api'  // Update with your actual domain and path
    : 'http://localhost:3000';

// Create an Axios instance with the configured base URL
const axiosInstance = axios.create({
    baseURL,
});

export default axiosInstance;

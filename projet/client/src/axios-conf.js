// axios-conf.js
import axios from 'axios';
import https from 'https';

// Set the base URL globally for Axios
axios.defaults.baseURL = 'http://localhost:3000';

// Ignore SSL verification (for development purposes only)
axios.interceptors.request.use((config) => {
    return config;
});

export default axios;

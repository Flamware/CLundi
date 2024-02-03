// axios-conf.js
import axios from 'axios';
import https from 'https';

// Set the base URL globally for Axios
axios.defaults.baseURL = 'https://87.106.121.11:8445';

// Ignore SSL verification (for development purposes only)
axios.interceptors.request.use((config) => {
    return config;
});

export default axios;

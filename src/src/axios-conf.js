import axios from 'axios';

// Set the base URL globally for Axios
axios.defaults.baseURL = 'http://localhost:8080'; // Replace with your API base URL

axios.interceptors.request.use((config) => {
    // You can modify headers or perform other actions before the request is sent
    // config.headers.common['Authorization'] = 'Bearer ' + getToken();
    return config;
});

export default axios;
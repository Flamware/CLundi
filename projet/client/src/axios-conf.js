import axios from 'axios';

// Set the base URL globally for Axios
axios.defaults.baseURL = 'http://172.27.232.146:3000/';

axios.interceptors.request.use((config) => {
    // You can modify headers or perform other actions before the request is sent
    // config.headers.common['Authorization'] = 'Bearer ' + getToken();
    return config;
});

export default axios;
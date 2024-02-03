import axios from 'axios';

// Set the base URL globally for Axios
axios.defaults.baseURL = 'https://87.106.121.11:8445';

axios.interceptors.request.use((config) => {
    config.httpsAgent = new https.Agent({ rejectUnauthorized: false });
    return config;
});

export default axios;

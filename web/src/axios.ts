// Installed Utils
import axios, { AxiosResponse } from 'axios';
import nookies from 'nookies';

// Create axios instance
const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Set interceptor
instance.interceptors.request.use((config) => {

    // Get cookies
    const cookies = nookies.get(null);

    // Check if the jwt token is saved
    if (cookies.jwt_token) {
        config.headers.Authorization = `Bearer ${cookies.jwt_token}`;
    }

    return config;
    
},
(error) => {
    return Promise.reject(error);
});

// Export the Axios types
export type { AxiosResponse };

// Export Axios instance
export default instance;
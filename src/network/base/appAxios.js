import axios from 'axios';

const environmentUrl = import.meta.env.VITE_APP_BASE_URL;

const getToken = () => {
  // Check for token in localStorage first, fallback to env variable
  return localStorage.Authorization || import.meta.env.VITE_APP_TOKEN;
};

export const appAxios = axios.create({
  baseURL: environmentUrl,
  timeout: 300000,
});

// Add request interceptor to set token dynamically
appAxios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

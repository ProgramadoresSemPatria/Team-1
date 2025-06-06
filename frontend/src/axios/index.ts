import axios from 'axios';
import { projectConstants } from '../utils/constants';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(projectConstants.accessToken);
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem(projectConstants.accessToken);
    if (token && error.response && error.response.status === 401) {
      localStorage.removeItem(projectConstants.accessToken);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
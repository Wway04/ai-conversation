import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Unwrap { success, data } response wrapper from NestJS backend
api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    const data = error.response?.data;
    const msg =
      data?.error ||
      (Array.isArray(data?.message) ? data.message.join(', ') : data?.message) ||
      `Server error ${error.response?.status || ''}`;
    return Promise.reject(new Error(msg));
  },
);

export default api;

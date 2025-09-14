import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const baseURL = 'https://thepinkpact.onrender.com/';

const apiService = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const formDataService = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// ✅ Fix: make interceptor async
apiService.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken'); // await here
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiService.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

formDataService.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken'); // also fix here
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

formDataService.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default apiService;
export { formDataService };

// src/utils/axiosInstance.js
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';
// import {checkForUpdate} from './checkForUpdate';
import {Platform} from 'react-native';
import { storage } from '@/App';


const apiService = axios.create({
  baseURL: 'https://thepinkpact.onrender.com/',

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

export const baseURL = 'https://thepinkpact.onrender.com/';

apiService.interceptors.request.use(
  config => {
    const token = storage.getString('authToken');
    console.log("🚀 ~ token:", token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);
    
    

apiService.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  },
);

formDataService.interceptors.request.use(
  config => {
    const token = storage.getString('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

formDataService.interceptors.response.use(
  response => response,
  error => Promise.reject(error),
);

export default apiService;

export { formDataService };

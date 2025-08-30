export const API_CONFIG = {
  BASE_URL: 'https://thepinkpact.onrender.com',
  API_VERSION: 'v1',
  TIMEOUT: 15000,
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}/${API_CONFIG.API_VERSION}${endpoint}`;
}; 
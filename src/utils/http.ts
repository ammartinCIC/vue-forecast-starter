import axios from 'axios';

const http = axios.create();

// rapid api headers added with interceptors
http.interceptors.request.use((config) => {
  if (config.headers) {
    config.headers['X-RapidAPI-Key'] = import.meta.env.VITE_RAPIDAPI_KEY;
    config.headers['X-RapidAPI-Host'] = import.meta.env.VITE_RAPIDAPI_HOST;
  } else {
    config.headers = {
      'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
      'X-RapidAPI-Host': import.meta.env.VITE_RAPIDAPI_HOST
    };
  }
  return config;
});

export default http;

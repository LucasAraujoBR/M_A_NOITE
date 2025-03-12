import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5001',  // Substitua pela URL do seu backend
});

export default api;

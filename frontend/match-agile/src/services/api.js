import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',  // Substitua pela URL do seu backend
});

export default api;

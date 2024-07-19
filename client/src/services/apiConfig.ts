import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 500) {
      alert("Erro de conexão com nosso servidor.");
    }
    return Promise.reject(error);
  }
);

export default api;

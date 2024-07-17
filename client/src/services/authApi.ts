import axios from "axios";
import api from "./apiConfig";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data) {
        return error.response.data.message;
      }
    }
    return "Erro inesperado em nosso servidor.";
  }
};

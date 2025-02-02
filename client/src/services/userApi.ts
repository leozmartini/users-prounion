import axios from "axios";
import api from "./apiConfig";

export const getAllUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message);
      }
    } else {
      throw new Error("Erro inesperado");
    }
  }
};

export const createUser = async (name: string, email: string, password: string) => {
  try {
    const response = await api.post("/users", { name, email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message);
      }
    } else {
      throw new Error("Erro inesperado");
    }
  }
};

export const deleteUser = async (id: number) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message);
      }
    } else {
      throw new Error("Erro inesperado");
    }
  }
};

export const updateUser = async (id: number, name?: string, email?: string, password?: string) => {
  try {
    const response = await api.put(`/users/${id}`, {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message);
      }
    } else {
      throw new Error("Erro inesperado");
    }
  }
};

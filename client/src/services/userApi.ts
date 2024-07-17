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
      alert("An unexpected error occurred");
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
      alert("An unexpected error occurred");
    }
  }
};

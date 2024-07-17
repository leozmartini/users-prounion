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
      } else {
        alert("An error occurred");
      }
    } else {
      alert("An unexpected error occurred");
    }
  }
};

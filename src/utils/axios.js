// src/utils/axiosInstance.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/", // Base URL for your API
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
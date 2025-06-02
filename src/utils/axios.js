import axios from "axios";

const api = axios.create({
  baseURL: "https://soundmartserver.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

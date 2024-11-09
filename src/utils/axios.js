import axios from "axios";

const api = axios.create({
  baseURL: "https://soundmart.life/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
import axios from "axios";

// single axios instance used everywhere in the app so the base url is set once
// falls back to a relative path because in production the backend serves the
// frontend build itself, so the API lives on the same origin as the page
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
});

// attaches the saved jwt token to every outgoing request if the user is logged in
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;

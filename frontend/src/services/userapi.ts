import axios from "axios";
import EventBus from "../common/EventBus";
import AuthService from "./auth.service";

console.log("API URL:", process.env.VITE_API_URL);


const api = axios.create({
  baseURL: `${process.env.VITE_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});


api.interceptors.request.use(
  async (config) => {
    const user = AuthService.getCurrentUser();
    if (user && user.token) {
      config.headers["Authorization"] = `Bearer ${user.token}`;
    }
    
    let csrfToken = localStorage.getItem("CSRF_TOKEN");
    if (!csrfToken) {
      try {
        const response = await axios.get(
          `${process.env.VITE_API_URL}/api/csrf-token`,
          { withCredentials: true }
        );
        if (response.data.token) {
          csrfToken = response.data.token;
          localStorage.setItem("CSRF_TOKEN", response.data.token);
        }
      } catch (error) {
        console.error("Failed to fetch CSRF token", error);
      }
    }

    if (csrfToken) {
      config.headers["X-XSRF-TOKEN"] = csrfToken;
    }
    console.log("X-XSRF-TOKEN " + csrfToken);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only logout if we're not already on the login page
      if (window.location.pathname !== '/login') {
        EventBus.dispatch("logout");
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

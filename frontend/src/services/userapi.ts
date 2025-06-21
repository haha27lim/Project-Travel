import axios from "axios";

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

export default api;

import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired tokens gracefully
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // If 401 and we haven't already retried
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/auth/refresh`,
            { refresh_token: refreshToken }
          );
          const { access_token, refresh_token } = response.data;
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);

          // Retry the original request with new token
          original.headers.Authorization = `Bearer ${access_token}`;
          return client(original);
        } catch {
          // Refresh failed — clear everything and redirect to login
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      } else {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default client;

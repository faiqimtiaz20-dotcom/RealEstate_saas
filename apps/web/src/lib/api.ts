import axios from "axios";

/** Base URL for future API; UI-only phase uses mocks + optional MSW later */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("re_mock_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error?.message ??
      err.response?.data?.message ??
      err.message ??
      "Request failed";
    return Promise.reject(new Error(typeof message === "string" ? message : "Request failed"));
  },
);

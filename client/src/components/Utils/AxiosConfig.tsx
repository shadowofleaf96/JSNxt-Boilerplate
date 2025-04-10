import axios, { InternalAxiosRequestConfig } from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const AxiosConfig = axios.create({
  baseURL: `${backendUrl}/api`,
});

AxiosConfig.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default AxiosConfig;

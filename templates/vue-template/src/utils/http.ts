import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

http.interceptors.request.use(
  (config: AxiosRequestConfig): any => {
    const headers = config.headers || {};
    config.headers = {
      "Content-Type": "application/json",
      ...headers,
    };
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default http;

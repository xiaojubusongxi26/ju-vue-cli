import axios from "axios";
import { ElMessage } from "element-plus";
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const http = axios.create({
  baseURL: "/api",
});

http.interceptors.request.use(
  (config: AxiosRequestConfig): any => {
    const headers = config.headers || {};
    config.headers = {
      "Content-Type": "application/json",
      ...headers,
    };
    if (token) {
      config.headers.authToken = `${token}`;
      config.headers.accountId = userInfo.userId || "";
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response: AxiosResponse) => {
    // 统一消息处理
    if (response.status !== 200) {
      ElMessage.error("Server error");
    }
    // if (response.data.code !== 0) {
    //   ElMessage.warning(response.data.message);
    // }
    return response.data;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default http;

import axios from "axios";
import { ElMessage } from "element-plus";
import { useStore } from "@/store";

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 60000,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    let store = useStore()
    let token = store.userInfo?.token
    if (token) {
      config.headers['Springbok-Token'] = token
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 200) {
      ElMessage({
        message: res.message || "Error",
        type: "error",
        duration: 5 * 1000,
      });

      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    console.log("err" + error);
    ElMessage({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;

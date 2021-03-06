import axios from "axios";
import store from "@/store";
import storage from "store";
import notification from "ant-design-vue/es/notification";
import { VueAxios } from "./axios";
import { ACCESS_TOKEN } from "@/store/mutation-types";

const code = {
  SUCCESS_CODE: "0000", //成功状态码
  ERROR_CODE: "9999", //失败状态码
};

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 6000, // 请求超时时间
});

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data;
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN);
    if (error.response.status === 403) {
      notification.error({
        message: "Forbidden",
        description: data.message,
      });
    }
    if (error.response.status === 401) {
      notification.error({
        message: "Unauthorized",
        description: "Authorization verification failed",
      });
      if (token) {
        // todo
        store.dispatch("user/logout").then(() => {
          window.location.reload();
        });
      }
    }
  }
  return Promise.reject(error);
};

// request interceptor
request.interceptors.request.use((config) => {
  const token = storage.get(ACCESS_TOKEN);
  // 让每个请求携带自定义 token
  if (token) {
    config.headers["Access-Token"] = token;
  }
  return config;
}, errorHandler);

// response interceptor
request.interceptors.response.use((response) => {
  if (response.data.code !== code.SUCCESS_CODE) {
    notification.error({
      message: response.data.msg,
    });
    return Promise.reject();
  }
  return response.data.data;
}, errorHandler);

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, request);
  },
};

export default request;

export { installer as VueAxios, request as axios };

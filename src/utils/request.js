import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";

import { gettime } from "@/utils/auth";
import router from "@/router";
const timeout = 60000000;
function checktimeout() {
  return Date.now() - gettime() < timeout;
}

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
});
// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 在这个位置需要统一的去注入token
    const token = store.getters.token;
    if (token) {
      // 如果token存在 注入token
      if (checktimeout()) {
        config.headers["Authorization"] = `Bearer ${token}`;
      } else {
        store.dispatch("user/logOut");
        router.push("/login");
        Message.error("登录超时");
        return Promise.reject("");
      }
    }
    return config; // 必须返回配置
  },
  (error) => Promise.reject(error)
);
// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // axios默认加了一层data
    const {
      data: { success, message, data },
    } = response;
    //   要根据success的成功与否决定下面的操作
    if (success) {
      return data;
    }
    Message.error(message || "系统错误"); // 提示错误消息
    return Promise.reject(new Error(message));
  },
  (error) => {
    if (error.response.status === 401) {
      store.dispatch("user/logOut");
      router.push("/login");
    }
    Message.error(error.response?.data?.message || "系统错误");
    return Promise.reject(error);
  }
);
// 默认导出
export default request;

import Taro from "@tarojs/taro";

// 设置基本的 API URL
const BASE_URL = "http://localhost:3000/api"; // 修改为你的后端地址

// 注册接口
export const apiRegister = (data) =>
  Taro.request({
    url: `${BASE_URL}/register`, // 拼接完整的注册接口 URL
    method: "POST",
    data,
  });

// 登录接口
export const apiLogin = (data) =>
  Taro.request({
    url: `${BASE_URL}/login`,
    method: "POST",
    data,
  });

// 发起需要认证的请求时，带上 token
export const apiRequestWithAuth = async (url, method, data) => {
  const token = Taro.getStorageSync("token");

  const res = await Taro.request({
    url: `${BASE_URL}${url}`,
    method,
    data,
    header: {
      Authorization: `Bearer ${token}`, // 在请求头中加入 token
    },
  });

  return res;
};

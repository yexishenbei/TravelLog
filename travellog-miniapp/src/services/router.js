import Taro from "@tarojs/taro";

// 白名单页面（无需登录）
const WHITE_LIST = ["pages/login/index", "pages/register/index"];

// 获取当前页面路径（带参数）
function getCurrentPageUrl() {
  const pages = Taro.getCurrentPages();
  const currentPage = pages[pages.length - 1];
  if (!currentPage) return "";
  const url = currentPage.route;
  const options = currentPage.options || {};
  const query = Object.keys(options)
    .map((key) => `${key}=${options[key]}`)
    .join("&");
  return query ? `${url}?${query}` : url;
}

// 判断是否在白名单中
function isInWhiteList(url) {
  return WHITE_LIST.includes(url.split("?")[0]);
}

// 检查是否已登录
function isLoggedIn() {
  const token = Taro.getStorageSync("token");
  return !!token;
}

// 路由拦截器对象
export const routerInterceptor = {
  // 初始化拦截器（在 app.js 中调用）
  init() {
    const interceptor = function (chain) {
      const requestParams = chain.requestParams;
      const { url } = requestParams;

      if (isInWhiteList(url)) {
        return chain.proceed(requestParams);
      }

      if (!isLoggedIn()) {
        const redirect = encodeURIComponent(url);
        Taro.redirectTo({
          url: `/pages/login/index?redirect=${redirect}`,
        });
        return Promise.reject(new Error("未登录"));
      }

      return chain.proceed(requestParams);
    };

    Taro.addInterceptor(interceptor);
  },

  // 手动检查登录（可在页面事件中使用）
  checkLogin() {
    if (!isLoggedIn()) {
      const redirect = encodeURIComponent(getCurrentPageUrl());
      Taro.redirectTo({
        url: `/pages/login/index?redirect=${redirect}`,
      });
      return false;
    }
    return true;
  },
};

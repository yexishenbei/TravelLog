import { useEffect } from "react";
import Taro from "@tarojs/taro";

const WHITE_LIST = ["pages/login/index", "pages/register/index"];

export const useAuthCheck = () => {
  useEffect(() => {
    const token = Taro.getStorageSync("token");
    const pages = Taro.getCurrentPages();
    const route = pages[pages.length - 1]?.route || "";

    if (!token && !WHITE_LIST.includes(route)) {
      Taro.redirectTo({
        url: "/pages/login/index",
      });
    }
  }, []);
};

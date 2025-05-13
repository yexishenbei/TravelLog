import { View, Text, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";

const Navbar = () => {
  // 搜索按钮点击事件，跳转到搜索页面
  const handleSearchClick = () => {
    Taro.navigateTo({
      url: "/pages/search/index",
    });
  };

  return (
    <View className="navbar">
      <View className="navbar-search" onClick={handleSearchClick}>
        搜索
      </View>
    </View>
  );
};

export default Navbar;

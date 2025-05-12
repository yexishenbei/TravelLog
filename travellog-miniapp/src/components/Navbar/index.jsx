import { View, Text, Image } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";

const Navbar = ({ title, showBack = true, onShare }) => {
  // 处理搜索点击事件
  const handleSearchClick = () => {
    Taro.showToast({
      title: "搜索功能开发中",
      icon: "none",
    });
  };

  // 处理返回点击事件
  const handleBackClick = () => {
    try {
      // 获取当前页面栈
      const pages = Taro.getCurrentPages();
      if (pages && pages.length > 1) {
        Taro.navigateBack(); // 后退到上一页
      } else {
        Taro.showToast({
          title: "没有上一页",
          icon: "none",
        });
      }
    } catch (error) {
      Taro.showToast({
        title: "获取页面栈失败",
        icon: "none",
      });
    }
  };

  // 获取当前页面栈的长度，决定是否显示返回按钮
  const shouldShowBack = () => {
    if (!showBack) return false;
    try {
      const pages = Taro.getCurrentPages();
      return pages && pages.length > 1;
    } catch (error) {
      return false;
    }
  };

  return (
    <View className="navbar">
      <View className="left">
        {shouldShowBack() && (
          <View className="back" onClick={handleBackClick}>
            <Text className="icon">←</Text>
          </View>
        )}
      </View>
      <View className="center">
        <Image className="logo" src="https://picsum.photos/50/50" />
        <Text className="title">{title}</Text>
      </View>
      <View className="right">
        {onShare && (
          <View className="share" onClick={onShare}>
            <Text className="icon">↗</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Navbar;

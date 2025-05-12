import { View, Text } from "@tarojs/components";
import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import "./index.scss";
import { useAuthCheck } from "../../hooks/useAuthCheck";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 使用认证检查 hook
  useAuthCheck();

  useEffect(() => {
    // 这里可以添加加载首页数据的逻辑
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View className="loading">
        <Text>加载中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="error">
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View className="index-page">
      <View className="welcome">
        <Text className="title">欢迎使用旅游日记</Text>
        <Text className="subtitle">记录你的每一次旅行</Text>
      </View>
    </View>
  );
};

export default Index;

import { View, Text } from "@tarojs/components";
import { useEffect } from "react";
import Taro from "@tarojs/taro";
import { userStorage } from "../../services/storage";

const PublishNote = () => {
  useEffect(() => {
    const user = userStorage.getCurrentUser();
    if (!user) {
      Taro.redirectTo({ url: "/pages/login/index" });
    }
  }, []);

  return (
    <View>
      <Text>发布笔记</Text>
    </View>
  );
};

export default PublishNote;

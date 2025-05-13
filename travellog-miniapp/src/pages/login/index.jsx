import { useState } from "react";
import { View, Input, Button, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { apiLogin } from "../../services/api"; // 导入封装的登录接口

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!username.trim()) {
      Taro.showToast({ title: "请输入用户名", icon: "none" });
      return false;
    }

    if (!password.trim()) {
      Taro.showToast({ title: "请输入密码", icon: "none" });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // 使用封装的 API 调用登录接口
      const response = await apiLogin({ username, password });
      console.log("Login response:", response); // 添加日志

      if (response.statusCode === 200 && response.data.status === "success") {
        // 保存 token 到本地存储
        Taro.setStorageSync("token", response.data.data.token);
        Taro.setStorageSync("userInfo", response.data.data.user);
        console.log("Stored userInfo", response.data.data.user);

        Taro.showToast({ title: "登录成功", icon: "success" });
        Taro.switchTab({ url: "/pages/index/index" });
      } else {
        Taro.showToast({
          title: response.data?.message || "用户名或密码错误",
          icon: "none",
        });
      }
    } catch (error) {
      console.error("Login error:", error); // 添加错误日志
      Taro.showToast({
        title: error.message || "登录失败，请稍后再试",
        icon: "none",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: "20px" }}>
      <View style={{ marginBottom: "30px", textAlign: "center" }}>
        <Text style={{ fontSize: "24px", fontWeight: "bold" }}>旅游日记</Text>
      </View>

      <View style={{ marginBottom: "20px" }}>
        <Text style={{ display: "block", marginBottom: "8px" }}>用户名</Text>
        <Input
          style={{
            width: "100%",
            height: "40px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "0 10px",
          }}
          placeholder="请输入用户名"
          value={username}
          onInput={(e) => setUsername(e.detail.value)}
        />
      </View>

      <View style={{ marginBottom: "20px" }}>
        <Text style={{ display: "block", marginBottom: "8px" }}>密码</Text>
        <Input
          style={{
            width: "100%",
            height: "40px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "0 10px",
          }}
          placeholder="请输入密码"
          type="password"
          value={password}
          onInput={(e) => setPassword(e.detail.value)}
        />
      </View>

      <Button
        style={{
          width: "100%",
          height: "40px",
          backgroundColor: "#1890ff",
          color: "#fff",
          borderRadius: "4px",
          marginTop: "20px",
        }}
        onClick={handleSubmit}
        loading={loading}
        disabled={loading}
      >
        登录
      </Button>

      <View style={{ marginTop: "16px", textAlign: "center" }}>
        <Text
          style={{ color: "#1890ff" }}
          onClick={() => Taro.navigateTo({ url: "/pages/register/index" })}
        >
          没有账号？去注册
        </Text>
      </View>
    </View>
  );
};

export default Login;

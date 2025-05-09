import { useState } from "react";
import { View, Input, Button, Text } from "@tarojs/components";
import { userStorage } from "../../services/storage";
import Taro from "@tarojs/taro";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!username.trim()) {
      Taro.showToast({
        title: "请输入用户名",
        icon: "none",
      });
      return false;
    }

    if (!password.trim()) {
      Taro.showToast({
        title: "请输入密码",
        icon: "none",
      });
      return false;
    }

    if (password.length < 6) {
      Taro.showToast({
        title: "密码长度不能少于6位",
        icon: "none",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        // 注册
        const user = userStorage.register(username, password);
        if (user) {
          Taro.showToast({
            title: "注册成功",
            icon: "success",
          });
          setIsRegister(false);
        } else {
          Taro.showToast({
            title: "用户名已存在",
            icon: "none",
          });
        }
      } else {
        // 登录
        const user = userStorage.login(username, password);
        if (user) {
          Taro.showToast({
            title: "登录成功",
            icon: "success",
          });
          Taro.switchTab({ url: "/pages/index/index" });
        } else {
          Taro.showToast({
            title: "用户名或密码错误",
            icon: "none",
          });
        }
      }
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
        {isRegister ? "注册" : "登录"}
      </Button>

      <View style={{ marginTop: "16px", textAlign: "center" }}>
        <Text
          style={{ color: "#1890ff" }}
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? "已有账号？去登录" : "没有账号？去注册"}
        </Text>
      </View>
    </View>
  );
};

export default Login;

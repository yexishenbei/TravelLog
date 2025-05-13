import { useState } from "react";
import { View, Input, Button, Text, Image } from "@tarojs/components";
import { apiRegister } from "../../services/api"; // 导入封装的注册接口
import Taro from "@tarojs/taro";

const DEFAULT_AVATAR =
  "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [loading, setLoading] = useState(false);

  // 表单验证
  const validateForm = () => {
    if (!username.trim()) {
      Taro.showToast({ title: "请输入用户名", icon: "none" });
      return false;
    }
    if (!password.trim()) {
      Taro.showToast({ title: "请输入密码", icon: "none" });
      return false;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8}$/;
    if (!passwordRegex.test(password)) {
      Taro.showToast({
        title: "密码必须包含字母和数字，且长度为8位",
        icon: "none",
      });
      return false;
    }

    return true;
  };

  // 选择头像
  const handleChooseAvatar = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: (res) => {
        setAvatar(res.tempFilePaths[0]);
      },
    });
  };

  // 提交注册请求
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await apiRegister({ username, password, avatar });
      if (response?.data?.status === "error") {
        Taro.showToast({
          title: response?.data?.message || "注册失败",
          icon: "none",
        });
      } else {
        Taro.showToast({
          title: "注册成功",
          icon: "success",
        });
        setTimeout(() => {
          Taro.navigateBack();
        }, 500);
      }
    } catch (error) {
      console.log("注册失败，错误信息:", error);
      Taro.showToast({
        title: error?.message || "注册失败，请稍后再试",
        icon: "none",
      });
    } finally {
      setLoading(false);
    }
  };

  // 跳转到登录页面
  const goToLogin = () => {
    Taro.navigateBack();
  };

  return (
    <View style={{ padding: "20px" }}>
      <View style={{ marginBottom: "30px", textAlign: "center" }}>
        <Text style={{ fontSize: "24px", fontWeight: "bold" }}>注册账号</Text>
      </View>

      <View style={{ marginBottom: "20px", textAlign: "center" }}>
        <Image
          src={avatar}
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            marginBottom: "10px",
          }}
          onClick={handleChooseAvatar}
        />
        <Text style={{ color: "#1890ff", fontSize: "14px" }}>点击更换头像</Text>
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
          placeholder="请输入密码（字母+数字，8位）"
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
        注册
      </Button>

      <View style={{ marginTop: "16px", textAlign: "center" }}>
        <Text style={{ color: "#1890ff" }} onClick={goToLogin}>
          已有账号？去登录
        </Text>
      </View>
    </View>
  );
};

export default Register;

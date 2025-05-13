import { View, Text, Input, Textarea, Button, Image } from "@tarojs/components";
import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import "./publish.scss";

const Publish = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [creator, setCreator] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const userInfo = Taro.getStorageSync("userInfo");
    const token = Taro.getStorageSync("token");
    console.log("完整的userInfo:", userInfo);
    console.log("token:", token);

    if (userInfo && token) {
      // 检查用户信息的所有可能字段
      const username =
        userInfo.username ||
        userInfo.name ||
        userInfo.nickname ||
        userInfo.userName;
      console.log("找到的用户名:", username);

      if (username) {
        setCreator(username);
        setIsReady(true);
      } else {
        console.log("用户信息结构:", JSON.stringify(userInfo, null, 2));
        Taro.showToast({
          title: "用户信息不完整，请重新登录",
          icon: "none",
          duration: 2000,
          success: () => {
            setTimeout(() => {
              Taro.redirectTo({ url: "/pages/login/index" });
            }, 2000);
          },
        });
      }
    } else {
      Taro.showToast({
        title: "请先登录",
        icon: "none",
        duration: 2000,
        success: () => {
          setTimeout(() => {
            Taro.redirectTo({ url: "/pages/login/index" });
          }, 2000);
        },
      });
    }
  }, []);

  const handleChooseImage = () => {
    Taro.chooseImage({
      count: 9,
      success: (res) => {
        const newImages = res.tempFilePaths;
        setImages([...images, ...newImages]);
      },
    });
  };

  const handleSubmit = () => {
    if (!isReady) {
      Taro.showToast({ title: "请先登录", icon: "none" });
      return;
    }

    if (!title.trim() || !content.trim()) {
      Taro.showToast({ title: "标题和内容不能为空", icon: "none" });
      return;
    }
    if (images.length === 0) {
      Taro.showToast({ title: "请至少上传一张图片", icon: "none" });
      return;
    }

    const noteData = {
      title,
      content,
      creator,
      add_time: new Date().toISOString(),
      status: "pending",
      images,
      videos: [],
    };
    console.log("提交的noteData:", noteData);

    Taro.request({
      url: "http://localhost:3000/api/notes",
      method: "POST",
      header: {
        "content-type": "application/json",
        Authorization: `Bearer ${Taro.getStorageSync("token")}`,
      },
      data: noteData,
      success: (res) => {
        console.log("发布响应:", res);
        if (res.statusCode === 200 || res.statusCode === 201) {
          Taro.showToast({ title: "发布成功", icon: "success" });
          setTimeout(() => {
            Taro.navigateBack();
          }, 1000);
        } else {
          Taro.showToast({
            title: res.data?.message || "发布失败",
            icon: "none",
          });
        }
      },
      fail: (err) => {
        console.error("发布失败:", err);
        Taro.showToast({
          title: err.errMsg || "发布失败，请稍后重试",
          icon: "none",
        });
      },
    });
  };

  if (!isReady) {
    return (
      <View className="loading">
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <View className="publish-page">
      <Text className="label">标题</Text>
      <Input
        className="input"
        value={title}
        placeholder="请输入标题"
        onInput={(e) => setTitle(e.detail.value)}
      />

      <Text className="label">内容</Text>
      <Textarea
        className="textarea"
        value={content}
        placeholder="请输入内容"
        onInput={(e) => setContent(e.detail.value)}
      />

      <Text className="label">上传图片</Text>
      <View className="image-list">
        {images.map((img, index) => (
          <Image key={index} src={img} className="preview-img" />
        ))}
        <Button className="choose-btn" onClick={handleChooseImage}>
          添加图片
        </Button>
      </View>

      <Button className="submit-btn" onClick={handleSubmit}>
        发布笔记
      </Button>
    </View>
  );
};

export default Publish;

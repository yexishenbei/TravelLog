import { View, Text } from "@tarojs/components";
import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import "./index.scss";
import { useAuthCheck } from "../../hooks/useAuthCheck";
import NoteCard from "../../components/NoteCard";
import Navbar from "../../components/Navbar";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState([]);

  // 使用认证检查 hook
  useAuthCheck();

  // 加载游记数据
  useEffect(() => {
    setLoading(true);
    Taro.request({
      url: "http://localhost:3000/api/notes",
      method: "GET",
      success: (res) => {
        if (res.data.status === "success") {
          // 过滤状态为 'approved' 的笔记
          const approvedNotes = res.data.data.filter(
            (note) => note.status === "approved"
          );
          setNotes(approvedNotes); // 只保存 approved 状态的笔记
        } else {
          setError("获取数据失败");
        }
        setLoading(false);
      },
      fail: () => {
        setError("请求失败，请稍后再试");
        setLoading(false);
      },
    });
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

  // 将游记分为两列
  const leftColumn = notes.filter((_, index) => index % 2 === 0);
  const rightColumn = notes.filter((_, index) => index % 2 === 1);

  return (
    <View className="index-page">
      <Navbar />
      <View className="waterfall-container">
        <View className="waterfall-column">
          {leftColumn.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </View>
        <View className="waterfall-column">
          {rightColumn.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </View>
      </View>
      <View
        className="fab"
        onClick={() => {
          Taro.navigateTo({ url: "/pages/note/publish" }); // 替换成你的发布页路径
        }}
      >
        +
      </View>
    </View>
  );
};

export default Index;

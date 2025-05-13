import { View, Text, Image, Swiper, SwiperItem } from "@tarojs/components";
import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import "./detail.scss";

const NoteDetail = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [note, setNote] = useState(null);

  // 获取笔记 ID 并加载数据
  useEffect(() => {
    const { id } = Taro.getCurrentInstance().router.params; // 获取笔记 ID
    if (id) {
      loadNoteData(id);
    } else {
      setError("无效的笔记 ID");
      setLoading(false);
    }
  }, []);

  // 加载笔记数据
  const loadNoteData = async (id) => {
    try {
      setLoading(true);
      const res = await Taro.request({
        url: `http://localhost:3000/api/notes/${id}`, // 获取具体的笔记数据
        method: "GET",
      });

      if (res.data.status === "success") {
        setNote(res.data.data); // 成功获取笔记数据
      } else {
        setError("笔记未找到");
      }
    } catch (err) {
      setError("请求失败，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  // 如果正在加载，显示加载提示
  if (loading) {
    return (
      <View className="loading">
        <Text>加载中...</Text>
      </View>
    );
  }

  // 如果有错误，显示错误信息
  if (error) {
    return (
      <View className="error">
        <Text>{error}</Text>
      </View>
    );
  }

  // 如果没有找到笔记，显示提示
  if (!note) {
    return (
      <View className="error">
        <Text>笔记不存在</Text>
      </View>
    );
  }

  // 正常展示笔记详情
  return (
    <View className="detail-page">
      {/* 用户名 */}
      <View className="note-user">
        <Text className="note-author">发布者：{note.creator}</Text>
      </View>
      {/* 发布时间 */}
      <View className="note-footer">
        <Text className="note-time">发布时间：{note.add_time}</Text>
      </View>
      {/* 图片轮播 */}
      {note.images && note.images.length > 0 && (
        <View className="note-images">
          <Swiper
            className="swiper-container"
            indicatorColor="#999"
            indicatorActiveColor="#333"
            circular
            autoplay={false}
            indicatorDots
          >
            {note.images.map((img, index) => (
              <SwiperItem key={index}>
                <Image src={img} className="note-image" mode="aspectFill" />
              </SwiperItem>
            ))}
          </Swiper>
        </View>
      )}

      {/* 标题和内容 */}
      <View className="note-body">
        <View>
          <Text className="note-title">{note.title}</Text>
        </View>
        <View>
          <Text className="note-content">{note.content}</Text>
        </View>
      </View>
    </View>
  );
};

export default NoteDetail;

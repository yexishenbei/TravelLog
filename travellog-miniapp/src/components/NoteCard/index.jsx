import { View, Image, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";

const NoteCard = ({ note }) => {
  // 点击卡片，跳转到详情页
  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/note/detail?id=${note.id}`,
    });
  };

  // 处理图片的默认值
  const imageUrl =
    note.images && note.images.length > 0
      ? note.images[0]
      : "https://via.placeholder.com/400x300?text=No+Image"; // 默认图片

  return (
    <View className="note-card" onClick={handleClick}>
      {/* 图片部分 */}
      <Image className="note-image" src={imageUrl} mode="aspectFill" />

      {/* 游记内容部分 */}
      <View className="note-content">
        <Text className="note-title" numberOfLines={2}>
          {note.title}
        </Text>
        <Text className="note-content-text" numberOfLines={2}>
          {note.content}
        </Text>

        {/* 游记信息底部 */}
        <View className="note-footer">
          <Text className="location">{note.location}</Text>
          <Text className="date">{note.date}</Text>
        </View>
      </View>
    </View>
  );
};

export default NoteCard;

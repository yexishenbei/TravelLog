import { View, Image, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";

// 修改后的 NoteCard 组件，接收整个 note 对象
const NoteCard = ({ note }) => {
  // 点击卡片，跳转到详情页
  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/note/detail?id=${note.id}`, // 使用 note.id 进行跳转
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
          {/* 在这里展示地点和日期 */}
          <Text className="location">{note.location}</Text>
          <Text className="date">{note.add_time}</Text>{" "}
          {/* 修改为 add_time 来展示日期 */}
        </View>
      </View>
    </View>
  );
};

export default NoteCard;

import { View, Image, Text, Swiper, SwiperItem } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";

// 修改后的 NoteCard 组件，接收整个 note 对象
const NoteCard = ({ note }) => {
  // 点击卡片，跳转到详情页
  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/note/detail?id=${note.log_id}`,
    });
    console.log("note", note);
  };

  return (
    <View className="note-card" onClick={handleClick}>
      {/* 如果有多张图片，则使用 Swiper 展示 */}
      {note.images && note.images.length > 0 ? (
        <Swiper
          className="note-image-swiper"
          indicatorColor="rgba(0, 0, 0, .3)"
          indicatorActiveColor="#000"
          circular
          autoplay
        >
          {note.images.map((image, index) => (
            <SwiperItem key={index}>
              <Image className="note-image" src={image} mode="aspectFill" />
            </SwiperItem>
          ))}
        </Swiper>
      ) : (
        <Image
          className="note-image"
          src="https://via.placeholder.com/400x300?text=No+Image"
          mode="aspectFill"
        />
      )}

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
        </View>
      </View>
    </View>
  );
};

export default NoteCard;

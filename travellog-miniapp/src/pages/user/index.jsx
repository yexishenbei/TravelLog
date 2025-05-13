import { View, Text, Button, Image } from "@tarojs/components";
import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import "./index.scss";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const storedUser = Taro.getStorageSync("userInfo");
    if (!storedUser) {
      Taro.redirectTo({ url: "/pages/login/index" });
    } else {
      setUser(storedUser);
      fetchUserNotes(storedUser.username);
    }
  }, []);

  const fetchUserNotes = async (username) => {
    const res = await Taro.request({
      url: "http://localhost:3000/api/user/notes",
      method: "POST",
      data: { username },
    });
    setNotes(res.data.data || []);
  };

  const handleDelete = async (id) => {
    await Taro.request({
      url: "http://localhost:3000/api/note/delete",
      method: "POST",
      data: { id },
    });
    fetchUserNotes(user.username);
  };

  const handleEdit = (note) => {
    Taro.navigateTo({
      url: `/pages/note/edit?id=${note.log_id}`,
    });
  };

  return (
    <View className="profile-page">
      <View className="user-info">
        <Image
          className="avatar"
          src="https://via.placeholder.com/80?text=头像"
        />
        <Text className="username">{user?.username}</Text>
      </View>

      <View className="note-list">
        {notes.map((note) => (
          <View key={note.log_id} className="note-item">
            <View className="note-image-wrapper">
              <Image
                className="note-thumbnail"
                src={
                  note.images?.[0] ||
                  "https://via.placeholder.com/100x70?text=No+Image"
                }
                mode="aspectFill"
              />
            </View>

            <View className="note-info">
              <View className="note-header">
                <Text className="note-title">{note.title}</Text>
                <Text className={`status ${note.status}`}>{note.status}</Text>
              </View>
              <Text className="note-content">
                {note.content.replace(/<[^>]+>/g, "").slice(0, 60)}...
              </Text>
              <View className="actions">
                <Button size="mini" onClick={() => handleEdit(note)}>
                  修改
                </Button>
                <Button
                  size="mini"
                  type="warn"
                  onClick={() => handleDelete(note.log_id)}
                >
                  删除
                </Button>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ProfilePage;

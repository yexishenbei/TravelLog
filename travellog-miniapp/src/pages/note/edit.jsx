import { View, Text, Textarea, Button } from "@tarojs/components";
import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import "./edit.scss";

const EditNotePage = () => {
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // 获取笔记 ID 并加载数据
  useEffect(() => {
    const { id } = Taro.getCurrentInstance().router.params; // 获取笔记 ID
    if (id) {
      loadNoteData(id);
    }
  }, []);

  const loadNoteData = async (id) => {
    setLoading(true);
    const res = await Taro.request({
      url: `http://localhost:3000/api/notes/${id}`, // 获取具体的笔记数据
      method: "GET",
    });
    if (res.data.status === "success") {
      setNote(res.data.data);
      setTitle(res.data.data.title);
      setContent(res.data.data.content);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Taro.showToast({
        title: "标题和内容不能为空",
        icon: "none",
      });
      return;
    }

    const updatedNote = { title, content };

    setLoading(true);
    try {
      console.log("Sending update data:", {
        log_id: note.log_id, // 确保 log_id 正确
        title,
        content,
      });
      const res = await Taro.request({
        url: `http://localhost:3000/api/note/update`,
        method: "POST",
        data: {
          log_id: note.log_id, // 发送 log_id 而不是 id（如果是 log_id 的话）
          title,
          content,
        },
      });

      if (res.data.status === "success") {
        Taro.showToast({
          title: "修改成功",
          icon: "success",
        });
        Taro.navigateBack(); // 返回到上一个页面
      } else {
        Taro.showToast({
          title: "修改失败，请稍后再试",
          icon: "none",
        });
      }
    } catch (error) {
      Taro.showToast({
        title: "请求失败，请稍后再试",
        icon: "none",
      });
      console.error("修改失败:", error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View className="loading">
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <View className="edit-note-page">
      <View className="header">
        <Text className="title">编辑笔记</Text>
      </View>

      {note && (
        <View className="form">
          <View className="input-group">
            <Text className="label">标题</Text>
            <Textarea
              value={title}
              onInput={(e) => setTitle(e.detail.value)}
              placeholder="请输入笔记标题"
              autoHeight
              maxlength={100}
            />
          </View>

          <View className="input-group">
            <Text className="label">内容</Text>
            <Textarea
              value={content}
              onInput={(e) => setContent(e.detail.value)}
              placeholder="请输入笔记内容"
              autoHeight
              maxlength={500}
            />
          </View>

          <Button
            className="save-button"
            onClick={handleSave}
            loading={loading}
            disabled={loading}
          >
            保存修改
          </Button>
        </View>
      )}
    </View>
  );
};

export default EditNotePage;

import { View, Text, Input } from "@tarojs/components";
import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import NoteCard from "../../components/NoteCard"; // 假设已存在
import Navbar from "../../components/Navbar";
import { useAuthCheck } from "../../hooks/useAuthCheck";
import "./index.scss";

const Search = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);

  // 使用认证检查 hook
  useAuthCheck();

  // 加载游记数据
  useEffect(() => {
    setLoading(true);
    Taro.request({
      url: "http://localhost:3000/api/notes", // 假设这是获取游记数据的 API 地址
      method: "GET",
      success: (res) => {
        if (res.data.status === "success") {
          setNotes(res.data.data);
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

  // 搜索功能
  const handleSearch = () => {
    const trimmedQuery = query.trim().toLowerCase();
    if (trimmedQuery) {
      const filtered = notes.filter((note) => {
        const matchTitle = note.title.toLowerCase().includes(trimmedQuery);
        const matchCreator = note.creator.toLowerCase() === trimmedQuery;
        return matchTitle || matchCreator;
      });
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes);
    }
  };

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

  return (
    <View className="search-page">
      <Navbar />

      <View className="search-bar">
        <Input
          type="text"
          placeholder="搜索标题或创建者"
          value={query}
          onInput={(e) => setQuery(e.detail.value)}
          confirmType="search"
          onConfirm={handleSearch}
        />
        <Text className="search-btn" onClick={handleSearch}>
          搜索
        </Text>
      </View>

      <View className="search-results">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => <NoteCard key={note.id} note={note} />)
        ) : (
          <Text className="no-result">暂无搜索结果</Text>
        )}
      </View>
    </View>
  );
};

export default Search;

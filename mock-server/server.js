const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;
const usersFilePath = path.join(__dirname, "mock", "users.json");
const notesFilePath = path.join(__dirname, "mock", "note.json");

app.use(cors());
app.use(bodyParser.json());

// 加载已注册用户
let users = {};
if (fs.existsSync(usersFilePath)) {
  users = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));
}

// 写入用户到 JSON 文件
function saveUsers() {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// 生成 token
function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// 注册接口
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required", status: "error" });
  }

  if (users[username]) {
    return res
      .status(409)
      .json({ message: "Username already exists", status: "error" });
  }

  users[username] = {
    password,
    id: Date.now().toString(),
    username,
  };
  saveUsers();

  return res.json({ message: "Registration successful", status: "success" });
});

// 登录接口
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt:", { username, password });

  const user = users[username];
  if (!user || user.password !== password) {
    return res
      .status(401)
      .json({ message: "Invalid username or password", status: "error" });
  }

  // 生成 token
  const token = generateToken();

  return res.json({
    message: "Login successful",
    status: "success",
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    },
  });
});

// 读取 note.json 文件
function getNotes() {
  const notesData = fs.readFileSync(notesFilePath, "utf-8");
  return JSON.parse(notesData);
}

// 模拟返回游记数据
app.get("/api/notes", (req, res) => {
  const notes = getNotes();
  res.json({
    status: "success",
    data: notes,
  });
});

// 获取全部笔记
app.get("/api/notes", (req, res) => {
  const notes = getNotes();
  res.json({ data: notes });
});

// 获取当前用户笔记
app.post("/api/user/notes", (req, res) => {
  const { username } = req.body;
  const notes = getNotes().filter((note) => note.creator === username);
  res.json({ data: notes });
});

// 删除笔记
app.post("/api/note/delete", (req, res) => {
  const { id } = req.body;
  let notes = getNotes();
  notes = notes.filter((note) => note.log_id !== id);
  saveNotes(notes);
  res.json({ message: "删除成功" });
});

// 修改笔记
app.post("/api/note/update", (req, res) => {
  const updatedNote = req.body;
  let notes = getNotes();
  const index = notes.findIndex((note) => note.log_id === updatedNote.log_id);

  if (index === -1) {
    return res.status(404).json({ message: "笔记未找到" });
  }

  notes[index] = { ...notes[index], ...updatedNote };
  saveNotes(notes);
  res.json({ message: "更新成功" });
});

// 审核通过接口
app.post("/api/note/approve", (req, res) => {
  const { log_id } = req.body;
  if (!log_id) {
    return res
      .status(400)
      .json({ message: "log_id is required", status: "error" });
  }
  let notes = getNotes(); // 获取当前游记列表
  const noteIndex = notes.findIndex((note) => note.log_id === log_id); // 查找对应游记
  if (noteIndex === -1) {
    return res
      .status(404)
      .json({ message: "Note not found", status: "error" });
  }
  // 更新游记状态为 approved
  notes[noteIndex].status = "approved";
  saveNotes(notes); // 保存更新后的数据
  return res.json({ message: "Note approved successfully", status: "success" });
});




app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

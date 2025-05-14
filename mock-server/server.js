const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;
const usersFilePath = path.join(__dirname, "mock", "users.json");
const notesFilePath = path.join(__dirname, "mock", "note.json");
const manageUsersFilePath = path.join(__dirname, "mock", "manage_user.json");

app.use(cors());
app.use(bodyParser.json());

// 加载已注册用户
let users = {};
if (fs.existsSync(usersFilePath)) {
  users = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));
}

// 加载管理系统用户
let manageUsers = {};
if (fs.existsSync(manageUsersFilePath)) {
  manageUsers = JSON.parse(fs.readFileSync(manageUsersFilePath, "utf-8"));
}

// 写入用户到 JSON 文件
function saveUsers() {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// 生成 token
function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// 获取笔记
// function getNotes() {
//   try {
//     const notesData = fs.readFileSync(notesFilePath, "utf-8");
//     return JSON.parse(notesData); // 如果读取失败会抛出异常
//   } catch (error) {
//     console.error("Failed to read notes:", error);
//     return []; // 返回空数组，避免崩溃
//   }
// }

// 获取笔记
function getNotes() {
  try {
    const notesData = fs.readFileSync(notesFilePath, "utf-8");
    const notes = JSON.parse(notesData);

    // 过滤掉已删除的笔记
    return notes.filter(note => !note.deleted);
  } catch (error) {
    console.error("Failed to read notes:", error);
    return []; // 返回空数组，避免崩溃
  }
}


// 保存笔记
function saveNotes(notes) {
  try {
    fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2), "utf-8"); // 如果写入失败会抛出异常
  } catch (error) {
    console.error("Failed to save notes:", error);
  }
}

// 注册接口
app.post("/api/register", (req, res) => {
  const { username, password, avatar } = req.body;

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
    id: Date.now().toString(),
    username,
    password,
    avatar: avatar || "", // 保存头像（为空也保留字段）
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
// function getNotes() {
//   const notesData = fs.readFileSync(notesFilePath, "utf-8");
//   return JSON.parse(notesData);
// }

// 写入笔记到 JSON 文件
function saveNotes(notes) {
  try {
    // 将更新后的笔记数据写入 note.json 文件
    fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving notes:', error);
    throw new Error('Failed to save notes');
  }
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

// 发布笔记接口
app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  console.log("收到的请求数据:", req.body); // 打印请求数据
  if (!newNote.title || !newNote.content || !newNote.creator) {
    return res.status(400).json({ message: "缺少必要字段", status: "error" });
  }

  const notes = getNotes();

  const log_id = Date.now().toString(); // 生成唯一 ID

  const noteToSave = {
    ...newNote,
    log_id, // 添加唯一 ID
    status: "pending", // 强制设为待审核
  };

  notes.unshift(noteToSave); // 新笔记放到最前面
  saveNotes(notes);

  res.json({ message: "笔记已保存", status: "success" });
});

// 获取单个笔记
app.get("/api/notes/:log_id", (req, res) => {
  const { log_id } = req.params;
  const notes = getNotes();
  const note = notes.find((note) => note.log_id === log_id);
  if (note) {
    res.json({ status: "success", data: note });
  } else {
    res.status(404).json({ message: "笔记未找到", status: "error" });
  }
});

app.post("/api/note/update", (req, res) => {
  const { log_id, title, content } = req.body;
  console.log("Received update request:", req.body); // 打印请求体

  try {
    let notes = getNotes(); // 获取所有笔记
    const index = notes.findIndex((note) => note.log_id === log_id);

    if (index === -1) {
      return res.status(404).json({ message: "笔记未找到" }); // 如果笔记不存在，返回 404
    }

    notes[index] = { ...notes[index], title, content, status: "pending" };
    saveNotes(notes); // 更新并保存笔记

    console.log("Note updated successfully:", notes[index]); // 打印更新后的笔记
    res.json({ status: "success", message: "笔记更新成功" });
  } catch (error) {
    console.error("Error updating note:", error); // 捕获并打印错误
    res.status(500).json({ message: "内部服务器错误" });
  }
});

// 管理后台-审核通过接口
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

// 登录接口 - 管理后台
app.post("/api/manage/login", (req, res) => {
  const { username, password } = req.body;

  console.log("Admin login attempt:", { username, password });

  // 查找后台管理系统的用户
  const user = manageUsers.find((user) => user.username === username);
  if (!user || user.password !== password) {
    return res
      .status(401)
      .json({ message: "Invalid username or password", status: "error" });
  }

  // 生成 token
  const token = generateToken();

  // 根据角色返回不同的信息
  let roleInfo = {};
  if (user.role === "admin") {
    roleInfo = { role: "admin", permissions: ["manage", "audit", "view"] }; // 管理员有更多权限
  } else if (user.role === "auditor") {
    roleInfo = { role: "auditor", permissions: ["audit", "view"] }; // 审核员只有审核和查看权限
  }

  return res.json({
    message: "Login successful",
    status: "success",
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
        permissions: roleInfo.permissions,
      },
    },
  });
});

// 管理后台-删除笔记（逻辑删除）
app.post("/api/note/deleteNote", (req, res) => {
  console.log("body是什么",req.body)
  const { log_id } = req.body;
  console.log("请求到了吗",log_id)
  let notes = getNotes();

  // 查找并逻辑删除指定笔记
  const noteIndex = notes.findIndex(note => note.log_id === log_id);
  
  if (noteIndex === -1) {
    return res.status(404).json({ message: "笔记未找到", status: "error" });
  }

  // 标记为已删除
  notes[noteIndex].deleted = true;
  
  saveNotes(notes);
  res.json({ message: "笔记已逻辑删除",status: "success", });
});

// 管理后台-拒绝笔记（更改状态为rejected）
app.post("/api/note/reject", (req, res) => {
  const { log_id } = req.body;

  if (!log_id) {
    return res.status(400).json({ message: "log_id is required", status: "error" });
  }

  let notes = getNotes(); // 获取所有笔记
  const noteIndex = notes.findIndex((note) => note.log_id === log_id); // 查找对应游记

  if (noteIndex === -1) {
    return res.status(404).json({ message: "Note not found", status: "error" });
  }

  // 更新游记状态为 rejected
  notes[noteIndex].status = "rejected";
  saveNotes(notes); // 保存更新后的数据

  return res.json({ message: "Note rejected successfully", status: "success" });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

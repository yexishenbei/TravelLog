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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const fs = require("fs");
const path = require("path");
const Mock = require("mockjs");

const usersFilePath = path.join(__dirname, "mock", "users.json");
const jwt = require("jsonwebtoken");
const secretKey = "your_secret_key";

// 初始化用户数据
let users = {};
if (fs.existsSync(usersFilePath)) {
  try {
    users = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));
  } catch (e) {
    console.error("用户数据加载失败：", e);
  }
}

// 保存用户数据到文件
function saveUsersToFile() {
  fs.mkdirSync(path.dirname(usersFilePath), { recursive: true });
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}
const loadUsersFromFile = () => {
  if (fs.existsSync(usersFilePath)) {
    try {
      users = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));
    } catch (e) {
      console.error("用户数据读取失败：", e);
      users = {}; // 避免读取失败后 users 变成 undefined
    }
  }
};

module.exports = {
  register: (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "用户名和密码不能为空" });
    }

    if (users[username]) {
      return res.status(400).json({ message: "用户名已存在" });
    }

    const avatar = Mock.Random.image("100x100", "#4A90E2", "#ffffff", "头像");

    // 存储用户
    users[username] = { username, password, avatar };
    saveUsersToFile();

    return res.json({
      message: "注册成功",
      user: { username, avatar },
    });
  },

  login: (req, res) => {
    const { username, password } = req.body;
    const user = users.get(username);

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "用户名或密码错误" });
    }

    // 生成 token
    const token = jwt.sign({ username: user.username }, secretKey, {
      expiresIn: "1h",
    }); // 设置过期时间为1小时

    return res.json({
      message: "登录成功",
      token, // 返回 token
      user: { username, avatar: user.avatar },
    });
  },
};

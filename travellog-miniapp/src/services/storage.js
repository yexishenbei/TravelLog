// import Taro from "@tarojs/taro";

// const USER_KEY = "current_user";

// class UserStorage {
//   constructor() {
//     this.users = Taro.getStorageSync("users") || [];
//   }

//   // 注册用户
//   register(username, password) {
//     // 检查用户名是否已存在
//     if (this.users.some((user) => user.username === username)) {
//       return null;
//     }

//     const newUser = {
//       id: Date.now().toString(),
//       username,
//       password,
//     };

//     this.users.push(newUser);
//     Taro.setStorageSync("users", this.users);
//     return newUser;
//   }

//   // 用户登录
//   login(username, password) {
//     const user = this.users.find(
//       (user) => user.username === username && user.password === password
//     );

//     if (user) {
//       // 保存当前用户信息
//       Taro.setStorageSync(USER_KEY, user);
//       return user;
//     }
//     return null;
//   }

//   // 获取当前登录用户
//   getCurrentUser() {
//     return Taro.getStorageSync(USER_KEY);
//   }

//   // 退出登录
//   logout() {
//     Taro.removeStorageSync(USER_KEY);
//   }
// }

// export const userStorage = new UserStorage();

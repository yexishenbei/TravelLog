# 使用Taro搭建微信小程序（创建项目）

参考文档：https://juejin.cn/post/7397292869604622351?searchId=202505081113138579CEA21E07350F24CC

## 安装 **Taro CLI**

在命令提示符中输入以下命令：

```bash
npm install -g @tarojs/cli
```

## 初始化项目

```
taro init travellog-miniapp
```

按照提示选择：

- 框架：React
- TypeScript：Yes
- 编译为 ES5：Yes
- CSS 预处理器：Sass
- 包管理工具：yarn
- 编译工具：Webpack5
- 模板源：GitHub
- 模板选择：redux（推荐）

------

### 遇到的问题

#### 1.PowerShell 禁止执行脚本

```
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 2. yarn未安装

```
npm install -g yarn
```

#### 3.缺少插件 `@tarojs/plugin-platform-weapp`

```
yarn add @tarojs/plugin-platform-weapp --dev
```

------

## 运行项目

```
yarn dev:weapp
```

成功运行后，项目会在我们的文件夹中生成一个 `dist` 目录，里面包含了编译后的文件。这些文件是小程序运行所需的最终代码。

## 修改项目配置

配置小程序的 `appid`。打开项目根目录下的 `project.config.json` 文件，找到 `appid` 字段，并将其替换为我们自己在微信公众平台注册的小程序的 AppID。

## 使用微信开发者工具

导入项目生成的 `/dist` 目录进行调试。
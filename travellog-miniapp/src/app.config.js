export default defineAppConfig({
  pages: [
    "pages/login/index",
    "pages/register/index",
    "pages/index/index",
    "pages/note/detail",
    "pages/user/index",
    "pages/note/publish",
    "pages/note/edit",
    "pages/search/index",
  ],

  window: {
    navigationBarBackgroundColor: "#ffffff",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
      },
      {
        pagePath: "pages/user/index",
        text: "我的",
      },
    ],
  },
});

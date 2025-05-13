import dayjs from "dayjs";
import { message } from "antd";
// 引入了游记列表类型
import { PowerApi, LoginApi, ResponseData, MenuInfoApi, MessageList, MessageAPi, MenuResponse, MenuList, MenuItem,LogList, LogListApi } from "@/types"
import { formatMenu } from "@/utils";

type MockDataType = {
  "/getmenu": MenuResponse
  "/getpower": PowerApi
  "/login": LoginApi
  "/addmenu": ResponseData
  "/addmessage": ResponseData
  "/getmessage": MessageAPi
  // 新增获取游记的接口
  "/getloglist": LogListApi
  "/delmenu": ResponseData
  "/getmenuinfo": ResponseData & { data: MenuItem | null }
  "/editmenuinfo": ResponseData
  "/getvisitordata": ResponseData
  [key: string]: ResponseData | MenuList | PowerApi | LoginApi | MenuInfoApi | MenuResponse
}
// 用户信息
const userInfoList = [
  {
    user_id: 1,
    username: "张同学",
    account: "admin",
    type_id: "超级管理员",
    t_id: 1,
  },
  {
    user_id: 2,
    username: "王五",
    account: "user",
    type_id: "用户",
    t_id: 2,
  },
  {
    user_id: 4,
    username: "李四",
    account: "qq123456",
    type_id: "游客",
    t_id: 3,
  },
  {
    user_id: 5,
    username: "路过的老鼠",
    account: "jake",
    type_id: "低权游客",
    t_id: 4,
  },
  {
    user_id: 6,
    username: "站长",
    account: "superAdmin",
    type_id: "超级管理员",
    t_id: 1,
  },
];
let currentUser = userInfoList[0];

// 菜单栏信息
let menu: MenuList = [
  {
    [MENU_TITLE]: "游记管理",
    [MENU_PATH]: "/logManagement",
    [MENU_KEY]: 20,
    [MENU_PARENTKEY]: null,
    [MENU_ICON]: "icon_list",
    [MENU_KEEPALIVE]: "false",
    [MENU_ORDER]: 1,
  },
  {
    [MENU_TITLE]: "列表页",
    [MENU_PATH]: "/list",
    [MENU_KEY]: 9,
    [MENU_PARENTKEY]: null,
    [MENU_ICON]: "icon_list",
    [MENU_KEEPALIVE]: "false",
    [MENU_ORDER]: 1,
  },
  {
    [MENU_TITLE]: "卡片列表",
    [MENU_PATH]: "/card",
    [MENU_KEY]: 10,
    [MENU_PARENTKEY]: 9,
    [MENU_ICON]: null,
    [MENU_KEEPALIVE]: "false",
    [MENU_ORDER]: 5485,
  },
  {
    [MENU_TITLE]: "查询列表",
    [MENU_PATH]: "/search",
    [MENU_KEY]: 11,
    [MENU_PARENTKEY]: 9,
    [MENU_ICON]: null,
    [MENU_KEEPALIVE]: "false",
    [MENU_ORDER]: 9588,
  },
  {
    [MENU_TITLE]: "表单页",
    [MENU_PATH]: "/form",
    [MENU_KEY]: 7,
    [MENU_PARENTKEY]: null,
    [MENU_ICON]: "icon_form",
    [MENU_KEEPALIVE]: "false",
    [MENU_ORDER]: 3,
  },
  {
    [MENU_TITLE]: "基础表单",
    [MENU_PATH]: "/index",
    [MENU_KEY]: 6,
    [MENU_PARENTKEY]: 7,
    [MENU_ICON]: null,
    [MENU_KEEPALIVE]: "false",
    [MENU_ORDER]: 9654,
  },
  {
    [MENU_TITLE]: "详情页",
    [MENU_PATH]: "/details",
    [MENU_KEY]: 1,
    [MENU_PARENTKEY]: null,
    [MENU_ICON]: "icon_edit",
    [MENU_KEEPALIVE]: "false",
    [MENU_ORDER]: 3,
  },
  {
    [MENU_TITLE]: "个人中心",
    [MENU_PATH]: "/person",
    [MENU_KEY]: 2,
    [MENU_PARENTKEY]: 1,
    [MENU_ICON]: "icon_infopersonal",
    [MENU_KEEPALIVE]: "false",
    [MENU_ORDER]: 9998,
  },
  {
    [MENU_TITLE]: "结果页",
    [MENU_PATH]: "/result",
    [MENU_KEY]: 16,
    [MENU_PARENTKEY]: null,
    [MENU_ICON]: "icon_voiceprint",
    [MENU_KEEPALIVE]: "false",
    [MENU_ORDER]: 4,
  },
  {
    [MENU_TITLE]: "403",
    [MENU_PATH]: "/403",
    [MENU_KEY]: 3,
    [MENU_PARENTKEY]: 16,
    [MENU_ICON]: "icon_locking",
    [MENU_KEEPALIVE]: "false",
    [MENU_ORDER]: 0,
  },
  {
    [MENU_TITLE]: "404",
    [MENU_PATH]: "/404",
    [MENU_KEY]: 4,
    [MENU_PARENTKEY]: 16,
    [MENU_ICON]: "icon_close",
    [MENU_KEEPALIVE]: "false",
    [MENU_ORDER]: 1,
  },
  {
    [MENU_TITLE]: "500",
    [MENU_PATH]: "/500",
    [MENU_KEY]: 5,
    [MENU_PARENTKEY]: 16,
    [MENU_ICON]: "icon_privacy_closed",
    [MENU_KEEPALIVE]: "false",
    [MENU_ORDER]: 4568,
  },
  {
    [MENU_TITLE]: "统计",
    [MENU_PATH]: "/statistics",
    [MENU_KEY]: 17,
    [MENU_PARENTKEY]: null,
    [MENU_ICON]: "icon_MTR",
    [MENU_KEEPALIVE]: "true",
    [MENU_ORDER]: 5,
  },
  {
    [MENU_TITLE]: "访客统计",
    [MENU_PATH]: "/visitor",
    [MENU_KEY]: 18,
    [MENU_PARENTKEY]: 17,
    [MENU_ICON]: "icon_addresslist",
    [MENU_KEEPALIVE]: "true",
    [MENU_ORDER]: 1,
  },
  {
    [MENU_TITLE]: "系统管理",
    [MENU_PATH]: "/power",
    [MENU_KEY]: 12,
    [MENU_PARENTKEY]: null,
    [MENU_ICON]: "icon_set",
    [MENU_KEEPALIVE]: "false",
    [MENU_ORDER]: 9,
  },
  {
    [MENU_TITLE]: "权限类别",
    [MENU_PATH]: "/type",
    [MENU_KEY]: 14,
    [MENU_PARENTKEY]: 12,
    [MENU_ICON]: "icon_safety",
    [MENU_KEEPALIVE]: "true",
    [MENU_ORDER]: 12,
  },
  {
    [MENU_TITLE]: "菜单管理",
    [MENU_PATH]: "/menu",
    [MENU_KEY]: 13,
    [MENU_PARENTKEY]: 12,
    [MENU_ICON]: "icon_menu",
    [MENU_KEEPALIVE]: "true",
    [MENU_ORDER]: 1475,
  },
  {
    [MENU_TITLE]: "用户管理",
    [MENU_PATH]: "/user",
    [MENU_KEY]: 15,
    [MENU_PARENTKEY]: 12,
    [MENU_ICON]: "icon_infopersonal",
    [MENU_KEEPALIVE]: "true",
    [MENU_ORDER]: 1593,
  },
  {
    [MENU_TITLE]: "图标库",
    [MENU_PATH]: "/icons",
    [MENU_KEY]: 8,
    [MENU_PARENTKEY]: null,
    [MENU_ICON]: "icon_pen",
    [MENU_KEEPALIVE]: "true",
    [MENU_ORDER]: 10,
  },
];

// 每种用户拥有的权限信息
const typeList = [
  {
    type_id: 1,
    name: "超级管理员",
    menu_id: "2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,20,1",
  },
  { type_id: 2, name: "用户", menu_id: "1,9,10,11,2,7,6,17,18,16,3,4,5,20,8" },
  { type_id: 3, name: "游客", menu_id: "9,1,10,11,2,7,6,17,18,12" },
  { type_id: 4, name: "低权游客", menu_id: "9,10" },
];

const power = {
  status: 0,
  data: typeList,
  mapKey: [
    { title: "权限id", dataIndex: "type_id", key: "type_id" },
    { title: "权限简称", dataIndex: "name", key: "name" },
    { title: "显示菜单列表id", dataIndex: "menu_id", key: "menu_id" },
  ],
  menu: formatMenu(menu),
};

const userInfo = {
  msg: "登录成功",
  status: 0,
  token: "12323",
  data: { user_id: 1, username: "超级管理员", account: "admin", type: "0", isLogin: true },
};

const addMenu = {
  msg: "添加成功,菜单栏需要关闭页面重新打开即可生效！",
  status: 0,
};
const addMsg = { msg: "添加成功", status: 0 };

// 获取信息列表
const msgList: MessageList = [
  {
    m_id: 1,
    name: "第一条消息",
    description: "我创建的第一天消息",
    creator: "超级管理员",
    add_time: "2021-04-20 17:01:09",
  },
  {
    m_id: 2,
    name: "RegExp",
    description:
      "RegExp 对象表示正则表达式,它是对字符串执行模式匹配的强大工具。 ",
    creator: "超级管理员",
    add_time: "2021-04-20 17:48:42",
  },
  {
    m_id: 3,
    name: "Ant Design",
    description:
      "antd 是基于 Ant Design 设计体系的 React UI 组件库，主要用于研发企业级中后台产品。",
    creator: "超级管理员",
    add_time: "2021-04-20 17:46:44",
  },
  {
    m_id: 4,
    name: "react-ant-admin",
    description:
      "此框架使用与二次开发，前端框架使用react，UI框架使用ant-design，全局数据状态管理使用redux，ajax使用库为axios。用于快速搭建中后台页面。",
    creator: "超级管理员",
    add_time: "2021-04-20 17:28:45",
  },
];
const msg: MessageAPi = {
  status: 0,
  data: {
    mapKey: [
      { title: "消息id", dataIndex: "m_id", key: "m_id" },
      { title: "消息名称", dataIndex: "name", key: "name" },
      { title: "消息描述词", dataIndex: "description", key: "description" },
      { title: "创建人", dataIndex: "creator", key: "creator" },
      { title: "创建时间", dataIndex: "add_time", key: "add_time" },
    ],
    list: msgList,
    total: 4,
  },

  msg: "",
};

// 游记列表
// const logList: LogList = [
//   {
//     log_id: 1,
//     title: "上海城市印象",
//     content: `
//       <h2>外滩夜景</h2>
//       <p>这是我第一次来到上海，夜晚的外滩灯火辉煌，令人震撼。</p>
//       <img src="https://dummyimage.com/600x400/ccc/000&text=外滩夜景" />
//       <p>这里有很多故事，也有很多人。</p>
//     `,
//     creator: "张同学",
//     add_time: "2024-12-01 10:30:00",
//     status: "待审核",
//   },
//   {
//     log_id: 2,
//     title: "迪士尼亲子行",
//     content: `
//       <h2>美妙的一天</h2>
//       <p>和家人一起在迪士尼度过了开心的一天。</p>
//       <img src="https://dummyimage.com/600x400/faf/000&text=迪士尼合影" />
//       <video width="400" controls>
//         <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
//         您的浏览器不支持视频播放。
//       </video>
//       <p>孩子们玩得特别开心！</p>
//     `,
//     creator: "王五",
//     add_time: "2025-01-15 14:00:00",
//     status: "已通过",
//   },
//   {
//     log_id: 3,
//     title: "乌镇水乡游记",
//     content: `
//       <p>乌镇的水巷非常有特色，古色古香。</p>
//       <img src="https://dummyimage.com/600x300/ddd/000&text=乌镇水巷" />
//     `,
//     creator: "李四",
//     add_time: "2025-03-12 08:25:00",
//     status: "已拒绝",
//   },
// ];
// 图片资源路径（模拟资源存储位置）
// const ASSET_PATH = '/assets/travel';
const ASSET_PATH = process.env.PUBLIC_URL + '/assets/travel'
// const ASSET_PATH = '../../assets/travel';

const logList: LogList = [
  {
    log_id: 1,
    title: "上海城市印象",
    content: `
      <div class="travel-log">
        <h2>外滩夜景</h2>
        <p>这是我第一次来到上海，夜晚的外滩灯火辉煌，令人震撼。</p>
        <div class="image-wrapper">
          <img src="${ASSET_PATH}/shanghai/bund-night.jpg" alt="上海外滩夜景" />
          <div class="caption">外滩的璀璨夜景，浦东的高楼大厦灯光璀璨</div>
        </div>
        <p>这里有很多故事，也有很多人。黄浦江两岸的建筑群展现了上海这座城市的现代与历史交融的独特魅力。</p>
        <div class="image-wrapper">
          <img src="${ASSET_PATH}/shanghai/traditional-street.jpg" alt="上海老街" />
          <div class="caption">老上海的石库门建筑，展现了城市的另一面</div>
        </div>
      </div>
    `,
    creator: "张同学",
    add_time: "2024-12-01 10:30:00",
    status: "待审核",
  },
  {
    log_id: 2,
    title: "迪士尼亲子行",
    content: `
      <div class="travel-log">
        <h2>美妙的一天</h2>
        <p>和家人一起在迪士尼度过了开心的一天。</p>
        <div class="video-wrapper">
          <video controls width="100%">
            <source src="${ASSET_PATH}/disney/family-day.mp4" type="video/mp4">
            您的浏览器不支持视频播放。
          </video>
          <div class="caption">孩子们与米奇的互动瞬间</div>
        </div>
        <p>孩子们玩得特别开心！我们参观了奇幻王国、明日世界、宝藏湾和探险岛等多个主题园区。</p>
        <div class="image-wrapper">
          <img src="${ASSET_PATH}/disney/castle-evening.jpg" alt="迪士尼城堡夜景" />
          <div class="caption">华灯初上的迪士尼城堡，梦幻无比</div>
        </div>
      </div>
    `,
    creator: "王五",
    add_time: "2025-01-15 14:00:00",
    status: "已通过",
  },
  {
    log_id: 3,
    title: "乌镇水乡游记",
    content: `
      <div class="travel-log">
        <h2>古色古香的水乡</h2>
        <p>乌镇的水巷非常有特色，古色古香。江南水乡的魅力在这里得到了完美的体现。</p>
        <div class="image-wrapper">
          <img src="${ASSET_PATH}/wuzhen/canal-view.jpg" alt="乌镇水巷" />
          <div class="caption">清晨的乌镇水巷，宁静而美丽</div>
        </div>
        <p>住在临水的客栈，听着潺潺的水声入睡，是一种难忘的体验。白天可以逛逛各种手工艺品店，晚上还可以欣赏当地的特色表演。</p>
        <div class="image-wrapper">
          <img src="${ASSET_PATH}/wuzhen/lantern-night.jpg" alt="乌镇夜景" />
          <div class="caption">夜晚的乌镇，灯火通明，别有一番风味</div>
        </div>
      </div>
    `,
    creator: "李四",
    add_time: "2025-03-12 08:25:00",
    status: "已拒绝",
  },
  {
    log_id: 4,
    title: "黄山徒步之旅",
    content: `
      <div class="travel-log">
        <h2>云海与奇松</h2>
        <p>黄山不愧是中国最美的山之一，雄奇秀丽的山峰、变幻莫测的云海和形态各异的奇松，构成了一幅幅天然的画卷。</p>
        <div class="image-wrapper">
          <img src="${ASSET_PATH}/huangshan/sea-of-clouds.jpg" alt="黄山云海" />
          <div class="caption">清晨的黄山云海，如梦如幻</div>
        </div>
        <p>爬山虽然辛苦，但看到这样的美景，所有的疲惫都值得了。特别是日出时分，阳光洒在云海上的那一刻，美不胜收。</p>
        <div class="image-wrapper">
          <img src="${ASSET_PATH}/huangshan/pine-tree.jpg" alt="黄山迎客松" />
          <div class="caption">黄山著名的迎客松，傲立山巅</div>
        </div>
        <p>在山顶的宾馆住了一晚，感受到了与平时完全不同的宁静与壮美。黄山的星空也非常清晰，是观星的好地方。</p>
      </div>
    `,
    creator: "赵六",
    add_time: "2025-04-03 16:45:00",
    status: "已通过",
  },
  {
    log_id: 5,
    title: "西藏拉萨朝圣之旅",
    content: `
      <div class="travel-log">
        <h2>神圣的布达拉宫</h2>
        <p>初到拉萨，就被布达拉宫的宏伟壮观所震撼。这座屹立在红山之上的宫殿，是藏传佛教的圣地，也是世界文化遗产。</p>
        <div class="image-wrapper">
          <img src="${ASSET_PATH}/tibet/potala-palace.jpg" alt="布达拉宫全景" />
          <div class="caption">宏伟的布达拉宫全景</div>
        </div>
        <p>在拉萨，随处可见虔诚的朝圣者。他们有的五体投地，有的手持转经筒，口中念诵着经文，神情专注而平和。</p>
        <div class="image-wrapper">
          <img src="${ASSET_PATH}/tibet/jokhang-temple.jpg" alt="大昭寺" />
          <div class="caption">大昭寺前的朝圣者</div>
        </div>
        <p>高原的阳光特别强烈，天空蓝得令人心醉。但也要注意高原反应，慢慢适应这里的海拔和气候。</p>
      </div>
    `,
    creator: "孙七",
    add_time: "2025-05-10 09:15:00",
    status: "待审核",
  }
];

const logApi: LogListApi = {
  status: 0,
  msg: "",
  data: {
    total: logList.length,
    list: logList,
    mapKey: [
      { title: "序号", dataIndex: "log_id", key: "log_id" },
      { title: "标题", dataIndex: "title", key: "title" },
      { title: "创建人", dataIndex: "creator", key: "creator" },
      { title: "创建时间", dataIndex: "add_time", key: "add_time" },
      { title: "审核状态", dataIndex: "status", key: "status" },
      // { title: "操作", dataIndex: "active", key: "active" },
    ],
  },
};



const delMenu = { msg: "操作成功", status: 0 };
// const MenuMapKey = [
//   { title: "菜单id", dataIndex: "menu_id", key: "menu_id" },
//   { title: "菜单名称", dataIndex: "title", key: "title" },
//   { title: "菜单路由", dataIndex: "path", key: "path" },
//   { title: "菜单唯一key", dataIndex: "key", key: "key" },
//   { title: "菜单父级key", dataIndex: "parentKey", key: "parentKey" },
//   { title: "菜单图标", dataIndex: "icon", key: "icon" },
//   { title: "页面是否保持状态", dataIndex: "keepAlive", key: "keepAlive" },
//   { title: "菜单排序", dataIndex: "order", key: "order" },
// ]
const MockData: MockDataType = {
  "/getmenu": formatMenu(menu),
  "/getpower": power,
  "/login": userInfo,
  "/addmenu": addMenu,
  "/addmessage": addMsg,
  "/getmessage": msg,
  "/delmenu": delMenu,
  // 注册获取游记api
  "/getloglist": logApi,
  "/getmenuinfo": { status: 0, msg: '', data: null },
  "/editmenuinfo": { status: 0, msg: "修改成功！" },
  "/getvisitordata": { status: 1, msg: "暂无" },
};
type UrlType = keyof MockDataType

// 模拟的get请求
function get(url: UrlType) {
  return new Promise((res) => {
    setTimeout(() => {
      if (url === "/getmenu") {
        let typeId = currentUser.t_id;
        if (typeId) {
          let action: string | undefined | number[] = typeList.find((i) => i.type_id === typeId)?.menu_id;
          action = action ? action.split(",").map(Number) : [];
          let menuList = menu.filter((i) => (action as number[]).includes(i[MENU_KEY] as number));
          MockData[url] = formatMenu(menuList);
        }
        res(MockData[url]);

        return;
      }
      res(MockData[url]);
    }, 500);
  }).then((res) => {
    if (res) {
      return res
    } else {
      message.error("接口暂未配置")
      return Promise.reject("接口暂未配置")
    }
  });
}

// 模拟的post请求

// function post(url: UrlType, data: any) {
//   return new Promise((res, rej) => {
//     setTimeout(() => {
//       switch (url) {
//         case "/login":
//           userInfo.data.account = data.account;
//           if (data.account.indexOf("admin") === -1) {
//             userInfo.data.type = "1";
//             userInfo.data.username = "普通用户";
//           }
//           return res(userInfo);
//         case "/addmenu":
//           menu.push(data);
//           return res(MockData[url]);
//         case "/addmessage":
//           msgList.push({
//             ...data,
//             m_id: Math.random(),
//             creator: userInfo.data.username,
//             add_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
//           });
//           if (msg.data) {
//             msg.data.total = msgList.length;
//           }
//           return res(MockData[url]);
//         case "/delmenu":
//           let newMenu = menu.filter((i) => i[MENU_KEY] !== data[MENU_KEY]);
//           menu = newMenu.filter((i) => i[MENU_PARENTKEY] !== data[MENU_KEY]);
//           return res(MockData[url]);
//         case "/getmenuinfo": {
//           const findInfo = menu.find((i) => i[MENU_KEY] === data[MENU_KEY]);
//           if (findInfo) {
//             MockData[url].data = findInfo;
//           }
//           return res(MockData[url]);
//         }
//         case "/editmenuinfo":
//           menu = menu.map((item) => {
//             if (item[MENU_KEY] === data[MENU_KEY]) {
//               return data;
//             }
//             return item;
//           });
//           return res(MockData[url]);
//         case "/getmessage":
//           console.log("我是post请求，我被执行")
//           let list = [...msgList];
//           if (data.name) {
//             list = list.filter((i) => i.name.includes(data.name));
//           }
//           if (data.description) {
//             list = list.filter((i) => i.description.includes(data.description));
//           }

//           if (msg.data) {
//             msg.data.total = list.length;
//             msg.data.list = list;
//           }
//           return res(msg);

//         case "/getloglist":
//           return res(logApi);

//         // 通过日志
//         case "/approvelog":
//           const approvedLog = logList.find(log => log.log_id === data.log_id);
//           if (approvedLog) {
//             approvedLog.status = "已通过"; // 修改为已通过状态
//             // 数据更新完后，返回成功状态
//             return res({ status: 0, msg: "审核通过成功" });
//           }
//           return res({ status: 1, msg: "未找到日志，审核失败" });

//         // 删除日志
//         case "/dellog":
//           const deleteIndex = logList.findIndex(log => log.log_id === data.log_id);
//           if (deleteIndex !== -1) {
//             logList.splice(deleteIndex, 1); // 从列表中删除
//             return res({ status: 0, msg: "删除成功" });
//           }
//           return res({ status: 1, msg: "未找到日志，删除失败" });

//         default:
//         res({ status: 1, msg: "暂无" });
//         break;
//       }
//     }, 100);
//   }).then((res: any) => {
//     if (res.status === 0) {
//       return res
//     } else {
//       message.error("接口暂未配置")
//       return Promise.reject("接口暂未配置")
//     }
//   });
// }

// mock/index.ts 的修改部分

// 只展示需要修改的部分代码

// 模拟的post请求
function post(url: UrlType, data: any) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      switch (url) {
        case "/login":
          userInfo.data.account = data.account;
          if (data.account.indexOf("admin") === -1) {
            userInfo.data.type = "1";
            userInfo.data.username = "普通用户";
          }
          return res(userInfo);
        case "/addmenu":
          menu.push(data);
          return res(MockData[url]);
        case "/addmessage":
          msgList.push({
            ...data,
            m_id: Math.random(),
            creator: userInfo.data.username,
            add_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          });
          if (msg.data) {
            msg.data.total = msgList.length;
          }
          return res(MockData[url]);
        case "/delmenu":
          let newMenu = menu.filter((i) => i[MENU_KEY] !== data[MENU_KEY]);
          menu = newMenu.filter((i) => i[MENU_PARENTKEY] !== data[MENU_KEY]);
          return res(MockData[url]);
        case "/getmenuinfo": {
          const findInfo = menu.find((i) => i[MENU_KEY] === data[MENU_KEY]);
          if (findInfo) {
            MockData[url].data = findInfo;
          }
          return res(MockData[url]);
        }
        case "/editmenuinfo":
          menu = menu.map((item) => {
            if (item[MENU_KEY] === data[MENU_KEY]) {
              return data;
            }
            return item;
          });
          return res(MockData[url]);
        case "/getmessage":
          console.log("我是post请求，我被执行")
          let list = [...msgList];
          if (data.name) {
            list = list.filter((i) => i.name.includes(data.name));
          }
          if (data.description) {
            list = list.filter((i) => i.description.includes(data.description));
          }

          if (msg.data) {
            msg.data.total = list.length;
            msg.data.list = list;
          }
          return res(msg);

        case "/getloglist":
          return res(logApi);

        // 通过日志
        case "/approvelog":
          const approvedLog = logList.find(log => log.log_id === data.id);
          if (approvedLog) {
            approvedLog.status = "已通过"; // 修改为已通过状态
            // 更新API数据
            logApi.data.list = [...logList];
            // 返回成功状态
            return res({ status: 0, msg: "审核通过成功" });
          }
          return rej({ status: 1, msg: "未找到日志，审核失败" });

        // 拒绝日志
        case "/rejectlog":
          const rejectedLog = logList.find(log => log.log_id === data.id);
          if (rejectedLog) {
            rejectedLog.status = "已拒绝"; // 修改为已拒绝状态
            // 更新API数据
            logApi.data.list = [...logList];
            // 返回成功状态
            return res({ status: 0, msg: "审核拒绝成功" });
          }
          return rej({ status: 1, msg: "未找到日志，拒绝失败" });

        // 删除日志
        case "/dellog":
          const deleteIndex = logList.findIndex(log => log.log_id === data.id);
          if (deleteIndex !== -1) {
            logList.splice(deleteIndex, 1); // 从列表中删除
            // 更新API数据
            logApi.data.list = [...logList];
            logApi.data.total = logList.length;
            return res({ status: 0, msg: "删除成功" });
          }
          return rej({ status: 1, msg: "未找到日志，删除失败" });

        default:
          res({ status: 1, msg: "暂无" });
          break;
      }
    }, 100);
  }).then((res: any) => {
    if (res.status === 0) {
      return res
    } else {
      message.error(res.msg || "接口暂未配置")
      return Promise.reject(res.msg || "接口暂未配置")
    }
  }).catch((err) => {
    message.error(err?.msg || "操作失败");
    return Promise.reject(err);
  });
}

// 其余代码保持不变...


const mock = { get, post };

export default mock;

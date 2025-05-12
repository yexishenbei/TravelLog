import Taro from "@tarojs/taro";

// 模拟数据
const mockData = {
  notes: [
    {
      id: 1,
      title: "杭州西湖一日游",
      content:
        "西湖的美景让人心旷神怡，断桥残雪、雷峰塔、三潭印月...\n漫步在西湖边，感受着微风拂面，看着湖面波光粼粼，心情格外舒畅。\n傍晚时分，夕阳西下，整个西湖都被染成了金色，美不胜收。",
      images: ["https://picsum.photos/400/300?random=1"],
      location: "杭州西湖",
      date: "2024-03-15",
      author: {
        id: 1,
        username: "旅行达人",
        avatar: "https://picsum.photos/100/100?random=1",
      },
    },
    {
      id: 2,
      title: "上海外滩夜景",
      content:
        "外滩的夜景太美了，黄浦江两岸的灯光璀璨...\n站在外滩，看着对岸陆家嘴的摩天大楼，感受着这座城市的繁华。\n江面上游船穿梭，霓虹灯倒映在水中，构成了一幅美丽的画卷。",
      images: ["https://picsum.photos/400/300?random=2"],
      location: "上海外滩",
      date: "2024-03-10",
      author: {
        id: 2,
        username: "城市探索者",
        avatar: "https://picsum.photos/100/100?random=2",
      },
    },
    {
      id: 3,
      title: "北京故宫游记",
      content:
        "故宫的宏伟建筑让人震撼，红墙黄瓦，气势恢宏...\n漫步在故宫的宫殿之间，仿佛穿越回了古代。\n每一座宫殿都诉说着历史的沧桑，每一块砖瓦都承载着岁月的痕迹。",
      images: ["https://picsum.photos/400/300?random=3"],
      location: "北京故宫",
      date: "2024-03-05",
      author: {
        id: 3,
        username: "历史爱好者",
        avatar: "https://picsum.photos/100/100?random=3",
      },
    },
    {
      id: 4,
      title: "成都锦里古街",
      content:
        "锦里古街的美食让人流连忘返，各种小吃应有尽有...\n从街头吃到街尾，每一家店都有其特色。\n除了美食，古街的建筑和氛围也让人感受到了浓浓的巴蜀文化。",
      images: ["https://picsum.photos/400/300?random=4"],
      location: "成都锦里",
      date: "2024-03-01",
      author: {
        id: 4,
        username: "美食家",
        avatar: "https://picsum.photos/100/100?random=4",
      },
    },
  ],
};

// 模拟延迟
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API 服务
export const mockService = {
  // 获取笔记列表
  async getNotes(params = {}) {
    await delay(500); // 模拟网络延迟
    let notes = [...mockData.notes];

    // 支持分页
    if (params.page && params.pageSize) {
      const start = (params.page - 1) * params.pageSize;
      const end = start + params.pageSize;
      notes = notes.slice(start, end);
    }

    // 支持搜索
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase();
      notes = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(keyword) ||
          note.content.toLowerCase().includes(keyword) ||
          note.location.toLowerCase().includes(keyword)
      );
    }

    return {
      code: 0,
      data: {
        list: notes,
        total: mockData.notes.length,
      },
      message: "success",
    };
  },

  // 获取笔记详情
  async getNoteDetail(id) {
    await delay(300);
    const note = mockData.notes.find((note) => note.id === id);
    if (!note) {
      return {
        code: 404,
        data: null,
        message: "笔记不存在",
      };
    }
    return {
      code: 0,
      data: note,
      message: "success",
    };
  },
};

// 统一请求方法
export const request = async (options) => {
  const { url, method = "GET", data } = options;

  try {
    // 根据环境选择请求方式
    if (process.env.TARO_ENV === "weapp") {
      // 小程序环境
      const res = await Taro.request({
        url,
        method,
        data,
      });
      return res.data;
    } else {
      // PC 环境，使用 mock 服务
      const [service, action] = url.split("/").slice(-2);
      const mockMethod = mockService[action];
      if (!mockMethod) {
        throw new Error(`Mock API not found: ${url}`);
      }
      return await mockMethod(data);
    }
  } catch (error) {
    console.error("Request failed:", error);
    return {
      code: 500,
      data: null,
      message: error.message || "请求失败",
    };
  }
};

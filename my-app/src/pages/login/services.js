import { post } from '../../utils/request'

export const LoginApi = async (data) => {
  try {
    const response = await post('/manage/login', data);  // 调用后端的管理系统登录接口
    return response.data;  // 返回响应数据
  } catch (error) {
    console.error('Login failed:', error);
    throw error;  // 抛出错误，便于调用者处理
  }
}

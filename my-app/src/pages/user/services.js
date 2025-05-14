import { get, post } from '../../utils/request';  // 引入封装好的post方法

// 获取所有已删除的游记
export const getDeletedNotes = async () => {
  try {
    console.log("我被执行了吗？")
    const response = await get('/deletedNotes');  // 向后端API请求已删除数据
    return response.data;  // 返回已删除的数据
  } catch (error) {
    console.error('Error fetching deleted notes:', error);
    throw error;  // 抛出错误，便于处理
  }
};
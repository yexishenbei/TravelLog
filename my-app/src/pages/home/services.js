import { get, post } from '../../utils/request';  // 引入封装好的post方法

// 获取游记数据
export const getData = async () => {
  try {
    const response = await get('/notes');  // 向后端API请求数据
    return response.data;  // 返回数据，假设response中有data字段
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;  // 抛出错误，便于处理
  }
};

// 审核通过请求
export const approveNote = async (log_id) => {
  try {
    const response = await post('/note/approve', { log_id });  // 向后端API发送POST请求
    return response.data;  // 返回响应数据
  } catch (error) {
    console.error('Error approving note:', error);
    throw error;  // 抛出错误，便于处理
  }
};

// 拒绝请求
export const rejectNote = async (log_id) => {
  try {
    const response = await post('/note/reject', { log_id });  // 向后端API发送POST请求
    return response.data;  // 返回响应数据
  } catch (error) {
    console.error('Error rejecting note:', error);
    throw error;  // 抛出错误，便于处理
  }
};

// 删除请求
export const deleteNote = async (log_id) => {
  try {
    console.log("没传过去？",log_id)
    const response = await post('/note/deleteNote', { log_id });  // 向后端API发送POST请求
    return response.data;  // 返回响应数据
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;  // 抛出错误，便于处理
  }
};

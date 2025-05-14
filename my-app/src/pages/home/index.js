import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message } from 'antd';
import { getData, approveNote, rejectNote, deleteNote } from './services';  // 引入getData, approveNote, rejectNote, deleteNote请求函数
import JourneyDetailModal from '../../components/journeyDetail'; // 引入JourneyDetailModal组件

const Home = () => {
  const [homeData, setHomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal的显示状态
  const [selectedJourney, setSelectedJourney] = useState(null); // 当前选择的游记详情
  const [role, setRole] = useState(null);  // 用于存储当前用户角色

  useEffect(() => {
    // 获取当前用户角色
    const currentUserRole = localStorage.getItem("role"); // 从localStorage获取用户角色
    setRole(currentUserRole);  // 设置角色

    const fetchData = async () => {
      try {
        const data = await getData();  // 调用getData函数获取数据
        setHomeData(data.data);  // 更新表格数据
        setLoading(false);  // 设置loading为false
      } catch (error) {
        message.error('数据加载失败');
        setLoading(false);
      }
    };

    fetchData();  // 执行数据获取函数
  }, []);  // 空依赖数组，确保仅在组件挂载时请求一次数据

  // 审核通过请求
  const handleApprove = async (log_id) => {
    try {
      const result = await approveNote(log_id);  // 调用approveNote请求函数
      if (result.status === 'success') {
        message.success('审核通过成功');
        setHomeData((prevData) =>
          prevData.map((note) =>
            note.log_id === log_id ? { ...note, status: 'approved' } : note
          )
        );
      } else {
        message.error(result.message || '审核失败');
      }
    } catch (error) {
      message.error('审核请求失败');
      console.error(error);
    }
  };

  // 拒绝请求
  const handleReject = async (log_id) => {
    try {
      const result = await rejectNote(log_id);  // 调用rejectNote请求函数
      if (result.status === 'success') {
        message.success('拒绝成功');
        setHomeData((prevData) =>
          prevData.map((note) =>
            note.log_id === log_id ? { ...note, status: 'rejected' } : note
          )
        );
      } else {
        message.error(result.message || '拒绝失败');
      }
    } catch (error) {
      message.error('拒绝请求失败');
      console.error(error);
    }
  };

  // 删除请求
  const handleDelete = async (log_id) => {
    try {
      const result = await deleteNote(log_id);  // 调用deleteNote请求函数
      if (result.status === 'success') {
        message.success('删除成功');
        setHomeData((prevData) =>
          prevData.filter((note) => note.log_id !== log_id)  // 移除已删除的笔记
        );
      } else {
        message.error(result.message || '删除失败');
      }
    } catch (error) {
      message.error('删除请求失败');
      console.error(error);
    }
  };

  const showModal = (journey) => {
    setSelectedJourney(journey);  // 设置当前选择的游记
    setIsModalVisible(true);  // 显示Modal
  };

  const handleCancel = () => {
    setIsModalVisible(false);  // 关闭Modal
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'log_id',
      key: 'log_id',
      render: (text, record, index) => index + 1, // 展示行号，但不会影响操作
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
    },
    {
      title: '创建时间',
      dataIndex: 'add_time',
      key: 'add_time',
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        switch (text) {
          case 'pending':
            return '待审核';
          case 'approved':
            return '已通过';
          case 'rejected':
            return '已拒绝';
          default:
            return text;  // 如果状态值是其他值，直接返回原始值
        }
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        const isPending = record.status === 'pending';

        // 判断当前用户角色，并决定显示哪些按钮
        const canApprove = role === 'admin' || role === 'auditor';
        const canReject = role === 'admin' || role === 'auditor';
        const canDelete = role === 'admin';

        return (
          <Space size="middle">
            <Button type="link" onClick={() => showModal(record)}>查看详情</Button>
            {canApprove && (
              <Button 
                type="link" 
                style={{ color: isPending ? 'green' : 'gray' }} 
                disabled={!isPending}  // 如果status不是pending，禁用按钮
                onClick={() => handleApprove(record.log_id)}  // 点击“通过”后传递log_id
              >
                通过
              </Button>
            )}
            {canReject && (
              <Button 
                type="link" 
                style={{ color: isPending ? 'red' : 'gray' }} 
                disabled={!isPending}  // 如果status不是pending，禁用按钮
                onClick={() => handleReject(record.log_id)}  // 点击“拒绝”后传递log_id
              >
                拒绝
              </Button>
            )}
            {canDelete && (
              <Button 
                type="link" 
                style={{ color: 'gray' }} 
                onClick={() => handleDelete(record.log_id)}  // 点击“删除”后传递log_id
              >
                删除
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={homeData}  // 确保数据是一个数组
        rowKey="log_id"
        loading={loading}
        pagination={false}
      />

      {/* 传递Modal的可见性、关闭方法和当前选中的游记 */}
      <JourneyDetailModal
        visible={isModalVisible}
        onCancel={handleCancel}
        journey={selectedJourney}
      />
    </div>
  );
};

export default Home;

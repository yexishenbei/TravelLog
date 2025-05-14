import React, { useEffect, useState } from 'react';
import { Table, message } from 'antd';
import { getDeletedNotes } from './services';  // 假设getData已封装

const User = () => {
  const [deletedData, setDeletedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeletedData = async () => {
      try {
        const data = await getDeletedNotes();  // 获取已删除游记数据
        setDeletedData(data.data);  // 更新已删除游记列表
        setLoading(false);
      } catch (error) {
        message.error('数据加载失败');
        setLoading(false);
      }
    };

    fetchDeletedData();  // 获取已删除数据
  }, []);

  const columns = [
    {
      title: '序号',
      dataIndex: 'log_id',
      key: 'log_id',
      render: (text, record, index) => index + 1,  // 序号
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
            return text;
        }
      },
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={deletedData}  // 渲染已删除的数据
        rowKey="log_id"
        loading={loading}
        pagination={false}
      />
    </div>
  );
};

export default User;

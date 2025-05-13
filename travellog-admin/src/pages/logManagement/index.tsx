import { useEffect, useState } from "react";
import { Button, Row, Col, Popconfirm, message } from "antd";
import MyTable from "@/components/table";
import LogDetailModal from "@/components/modal/log/logDetail";
// 引入接口函数
import { getLogList, approveLog, rejectLog, deleteLog } from "@/api";
import { LogItem, LogList, MapKey } from "@/types";
import "./index.less";

function useLogs() {
  const [tableData, setData] = useState<LogList>([]);
  const [tableCol, setCol] = useState<MapKey>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentLog, setCurrentLog] = useState<LogItem | null>(null);

  useEffect(() => {
    getData(); // 页面加载时获取数据
  }, []);

  const getData = () => {
    getLogList().then((res) => {
      if (res.status === 0 && res.data) {
        // 先保存原始的 mapKey
        const originalMapKey = [...res.data.mapKey];
        
        // 检查是否已经存在操作列
        const hasActionColumn = originalMapKey.some(col => col.key === 'action');
        
        // 如果没有操作列，才添加
        if (!hasActionColumn) {
          const actionCol = {
            title: "操作",
            dataIndex: "action",
            key: "action", // 使用固定的key，便于检查
            align: "center",
            render: (_: any, record: LogItem) => {
              // 检查日志状态，如果是"已通过"或"已拒绝"，则禁用按钮
              const isApprovedOrRejected = record.status === "已通过" || record.status === "已拒绝";

              return (
                <>
                  <Button 
                    type="link" 
                    onClick={() => handleViewDetail(record)} 
                  >
                    查看详情
                  </Button>
                  <Button 
                    type="link" 
                    onClick={() => handleApprove(record.log_id)} 
                    disabled={isApprovedOrRejected}
                  >
                    通过
                  </Button>
                  <Button 
                    type="link" 
                    danger 
                    onClick={() => handleReject(record.log_id)} 
                    disabled={isApprovedOrRejected}
                  >
                    拒绝
                  </Button>
                  <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.log_id)}>
                    <Button type="link" danger>
                      删除
                    </Button>
                  </Popconfirm>
                </>
              );
            }
          };
          originalMapKey.push(actionCol);
        }
        
        setCol(originalMapKey);
        setData(res.data.list); // 更新 tableData
      }
    });
  };

  const handleApprove = (id: number) => {
    approveLog(id).then((res) => {
      if (res && res.status === 0) {
        message.success("审核通过");
        
        // 直接更新本地状态，避免重新请求
        setData(prevData => 
          prevData.map(item => 
            item.log_id === id ? { ...item, status: "已通过" } : item
          )
        );
      } else {
        message.error("审核失败");
      }
    }).catch(() => {
      message.error("审核失败");
    });
  };

  const handleReject = (id: number) => {
    rejectLog(id).then((res) => {
      if (res && res.status === 0) {
        message.warning("已拒绝");
        
        // 直接更新本地状态，避免重新请求
        setData(prevData => 
          prevData.map(item => 
            item.log_id === id ? { ...item, status: "已拒绝" } : item
          )
        );
      } else {
        message.error("拒绝失败");
      }
    }).catch(() => {
      message.error("拒绝失败");
    });
  };

  const handleDelete = (id: number) => {
    deleteLog(id).then((res) => {
      if (res && res.status === 0) {
        message.success("删除成功");
        
        // 直接更新本地状态，避免重新请求
        setData(prevData => prevData.filter(item => item.log_id !== id));
        
        // 如果删除的是当前选中的行，也需要更新 selectedRowKeys
        setSelectedRowKeys(prevKeys => prevKeys.filter(key => key !== id));
      } else {
        message.error("删除失败");
      }
    }).catch(() => {
      message.error("删除失败");
    });
  };

  const handleViewDetail = (log: LogItem) => {
    setCurrentLog(log);
    setDetailVisible(true);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newKeys: React.Key[]) => {
      setSelectedRowKeys(newKeys as number[]);
    }
  };

  return {
    tableCol,
    tableData,
    rowSelection,
    detailVisible,
    currentLog,
    setDetailVisible
  };
}

export default function LogManagement() {
  const {
    tableCol,
    tableData,
    rowSelection,
    detailVisible,
    currentLog,
    setDetailVisible
  } = useLogs();

  return (
    <div className="type-container">
      <Row justify="space-between" gutter={80} style={{ marginBottom: 16 }}>
        <Col style={{ lineHeight: "32px" }}>游记管理列表</Col>
        <Col>
          <Button type="primary" disabled>批量审核功能暂未实现</Button>
        </Col>
      </Row>

      <MyTable
        rowKey="log_id"
        rowSelection={rowSelection}
        columns={tableCol}
        dataSource={tableData}
      />

      <LogDetailModal
        visible={detailVisible}
        log={currentLog}
        onCancel={() => setDetailVisible(false)}
      />
    </div>
  );
}

LogManagement.route = {
  [MENU_PATH]: "/logManagement"
};
import { useEffect, useState } from "react";
import { Button, Row, Col, Popconfirm, message } from "antd";
import MyTable from "@/components/table";
import LogDetailModal from "@/components/modal/log/logDetail";
// import { getLogList, approveLog, rejectLog, deleteLog } from "@/api";
import { getLogList } from "@/api";
import { LogItem, LogList, MapKey } from "@/types";
import "./index.less";

function useLogs() {
  const [tableData, setData] = useState<LogList>([]);
  const [tableCol, setCol] = useState<MapKey>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentLog, setCurrentLog] = useState<LogItem | null>(null);

  useEffect(() => {
    getData();
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
            render: (_: any, record: LogItem) => (
              <>
                <Button type="link" onClick={() => handleViewDetail(record)}>查看详情</Button>
                <Button type="link" onClick={() => handleApprove(record.log_id)}>通过</Button>
                <Button type="link" danger onClick={() => handleReject(record.log_id)}>拒绝</Button>
                <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.log_id)}>
                  <Button type="link" danger>删除</Button>
                </Popconfirm>
              </>
            )
          };
          originalMapKey.push(actionCol);
        }
        
        setCol(originalMapKey);
        setData(res.data.list);
      }
    });
  };

  const handleApprove = (id: number) => {
    console.log("按钮功能暂时未实现")
    // approveLog(id).then(() => {
    //   message.success("审核通过");
    //   getData();
    // });
  };

  const handleReject = (id: number) => {
    console.log("没实现呢！！！")
    // rejectLog(id).then(() => {
    //   message.warning("已拒绝");
    //   getData();
    // });
  };

  const handleDelete = (id: number) => {
    console.log("暂时未实现删除功能")
    console.log("我就看看打印的id",id)
    // deleteLog(id).then(() => {
    //   message.success("删除成功");
    //   getData();
    // });
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
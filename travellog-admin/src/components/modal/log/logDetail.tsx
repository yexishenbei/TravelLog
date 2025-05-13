import { Modal, Typography } from 'antd';
import { LogItem } from '@/types';
import './logDetail.less';

interface LogDetailModalProps {
  visible: boolean;
  log: LogItem | null;
  onCancel: () => void;
}

const LogDetailModal: React.FC<LogDetailModalProps> = ({ visible, log, onCancel }) => {
  const { Title, Text } = Typography;

  return (
    <Modal
      title="游记详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      className="log-detail-modal"
    >
      {log ? (
        <div className="log-detail-container">
          <div className="log-header">
            <Title level={3}>{log.title}</Title>
            <div className="log-meta">
              <Text type="secondary">作者: {log.creator}</Text>
              <Text type="secondary">添加时间: {log.add_time}</Text>
              <Text type="secondary">
                状态: <span className={`status ${log.status.replace(/[^\w\s]/g, '').toLowerCase()}`}>{log.status}</span>
              </Text>
            </div>
          </div>
          
          <div className="log-content">
            {/* 使用dangerouslySetInnerHTML来渲染富文本内容 */}
            <div dangerouslySetInnerHTML={{ __html: log.content }} />
          </div>
        </div>
      ) : (
        <div className="log-loading">加载中...</div>
      )}
    </Modal>
  );
};

export default LogDetailModal;
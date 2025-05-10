import { Modal } from "antd";
import { LogItem } from "@/types";

interface LogDetailModalProps {
  visible: boolean;
  log: LogItem | null;
  onCancel: () => void;
}

export default function LogDetailModal({ visible, log, onCancel }: LogDetailModalProps) {
  // 仅供测试：打印内容
  console.log("查看详情：", log?.content);

  return (
    <Modal
      title={log?.title || "游记详情"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <div>（此处为富文本详情展示区域）</div>
    </Modal>
  );
} 
// components/JourneyDetailModal.js
import React from 'react';
import { Modal, Card } from 'antd';

const JourneyDetailModal = ({ visible, onCancel, journey }) => {
  return (
    <Modal
      title="游记详情"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      {journey && (
        <Card title={journey.title}>
          <p><strong>创建人：</strong>{journey.creator}</p>
          <p><strong>创建时间：</strong>{journey.add_time}</p>
          <p><strong>审核状态：</strong>{journey.status === 'pending' ? '待审核' : journey.status === 'approved' ? '已通过' : '已拒绝'}</p>
          <p><strong>内容：</strong>{journey.content}</p>
          <div>
            <strong>图片：</strong>
            <div>
              {journey.images.map((image, index) => (
                <img key={index} src={image} alt="游记图片" style={{ width: '100px', marginRight: '10px' }} />
              ))}
            </div>
          </div>
          <div>
            <strong>视频：</strong>
            <div>
              {journey.videos.length > 0 ? (
                journey.videos.map((video, index) => (
                  <video key={index} controls style={{ width: '100%' }}>
                    <source src={video} type="video/mp4" />
                  </video>
                ))
              ) : (
                <p>暂无视频</p>
              )}
            </div>
          </div>
        </Card>
      )}
    </Modal>
  );
};

export default JourneyDetailModal;

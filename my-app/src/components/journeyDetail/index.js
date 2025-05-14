import React from 'react';
import { Modal, Card, Carousel } from 'antd';
import './index.css'; // 引入CSS文件

const JourneyDetailModal = ({ visible, onCancel, journey }) => {
  return (
    <Modal
      title="游记详情"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      className="journey-detail-modal"
    >
      {journey && (
        <Card title={journey.title} className="journey-card">
          {/* 作者、时间和状态放在一行 */}
          <div className="journey-header">
            <p><span><strong>作者：</strong>{journey.creator}</span> 
              <span><strong>发布时间：</strong>{journey.add_time}</span> 
              <span><strong>状态：</strong>{journey.status === 'pending' ? '待审核' : journey.status === 'approved' ? '已通过' : '已拒绝'}</span>
            </p>
          </div>
          <p><strong>内容：</strong>{journey.content}</p>
          
          {/* 图片轮播 */}
          {journey.images.length > 0 && (
            <div className="image-section">
              <strong>图片：</strong>
              <Carousel autoplay>
                {journey.images.map((image, index) => (
                  <div key={index}>
                    <img src={image} alt={`游记图片 ${index}`} className="journey-image" />
                  </div>
                ))}
              </Carousel>
            </div>
          )}
          
          {/* 视频放在最后，宽度占满整个卡片 */}
          {journey.videos.length > 0 ? (
            <div className="video-section">
              <strong>视频：</strong>
              <video controls className="journey-video">
                <source src={journey.videos[0]} type="video/mp4" />
              </video>
            </div>
          ) : (
            <p>暂无视频</p>
          )}
        </Card>
      )}
    </Modal>
  );
};

export default JourneyDetailModal;

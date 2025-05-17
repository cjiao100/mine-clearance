import React from 'react';
import Modal from './index';
import Leaderboard from '../Leaderboard';

interface LeaderboardModalProps {
  visible: boolean;
  onClose: () => void;
  activeTab?: string;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  visible,
  onClose,
  activeTab = 'all'
}) => {
  return (
    <Modal
      visible={visible}
      title=""
      onClose={onClose}
      hiddenBtn={true}
    >
      <div className="w-full">
        <Leaderboard onClose={onClose} activeTab={activeTab} />
      </div>
    </Modal>
  );
};

export default LeaderboardModal;

import React from 'react';

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose }) => {
  return (
    <div className="p-2 bg-gray-900 text-white flex justify-between items-center">
      <h4 className="text-sm font-semibold">Chat</h4>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-400 transition"
        aria-label="Close Chat"
      >
        ✕
      </button>
    </div>
  );
};

export default ChatHeader;

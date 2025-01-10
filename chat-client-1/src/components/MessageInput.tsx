import React, { useState } from 'react';

interface MessageInputProps {
  onSend: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <div className="flex border-t border-gray-700">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        className="flex-1 px-4 py-2 bg-black text-white placeholder-gray-500 outline-none"
      />
      <button
        onClick={handleSend}
        className="px-4 py-2 bg-white text-black hover:bg-gray-200 transition rounded-r-lg"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;

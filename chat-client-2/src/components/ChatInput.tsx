import React, { useState } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <div className="border-t border-gray-700 p-2 bg-gray-900 flex">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 bg-gray-800 text-white p-2 rounded-l-lg outline-none placeholder-gray-500"
      />
      <button
        onClick={sendMessage}
        className="bg-white text-black px-4 py-2 rounded-r-lg hover:bg-gray-200 transition"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;

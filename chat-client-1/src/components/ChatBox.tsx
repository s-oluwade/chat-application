import React, { useState } from 'react';
import { FiMessageSquare, FiX } from 'react-icons/fi';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);

  const toggleChat = () => setIsOpen((prev) => !prev);

  const handleSend = (message: string) => {
    setMessages((prev) => [...prev, { text: message, sender: 'User' }]);
  };

  return (
    <div className="fixed bottom-4 right-4">
      {/* Minimized Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition"
          aria-label="Open chat"
        >
          <FiMessageSquare size={24} />
        </button>
      )}

      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="w-80 h-96 bg-black text-white rounded-lg shadow-lg flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Chat</h2>
            <button
              onClick={toggleChat}
              className="text-gray-400 hover:text-white transition"
              aria-label="Close chat"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Chat History */}
          <MessageList messages={messages} />

          {/* Input Field */}
          <MessageInput onSend={handleSend} />
        </div>
      )}
    </div>
  );
};

export default ChatBox;

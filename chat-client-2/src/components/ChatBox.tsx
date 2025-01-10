import React, { useState } from 'react';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatInput from './ChatInput';

const ChatBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = (message: string) => {
    setMessages((prev) => [...prev, message]);
  };

  return (
    <div className="fixed bottom-4 right-4 w-80">
      {/* Collapsed Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="w-full bg-black text-white py-2 rounded-t-lg shadow-lg hover:bg-gray-800 transition"
        >
          Chat
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-black text-white border border-gray-700 rounded-lg shadow-lg flex flex-col">
          <ChatHeader onClose={toggleChat} />
          <ChatBody messages={messages} />
          <ChatInput onSend={handleSendMessage} />
        </div>
      )}
    </div>
  );
};

export default ChatBox;

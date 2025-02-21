import React from 'react';

interface Message {
  text: string;
  sender: string;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`my-2 flex ${
            msg.sender === 'User' ? 'justify-end' : 'justify-start'
          }`}
        >
          <span
            className={`px-3 py-2 rounded-lg ${
              msg.sender === 'User'
                ? 'bg-white text-black'
                : 'bg-gray-700 text-white'
            }`}
          >
            {msg.text}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MessageList;

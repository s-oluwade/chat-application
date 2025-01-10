import React from 'react';

interface ChatBodyProps {
  messages: string[];
}

const ChatBody: React.FC<ChatBodyProps> = ({ messages }) => {
  return (
    <div className="flex-1 p-3 overflow-y-auto">
      {messages.length === 0 ? (
        <p className="text-gray-500 text-sm text-center">No messages yet.</p>
      ) : (
        messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <p className="text-white bg-gray-800 p-2 rounded-lg">{msg}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatBody;

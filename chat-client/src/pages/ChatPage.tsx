import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Send, Image, FileText, BarChart } from "lucide-react";

interface Friend {
  id: number;
  name: string;
}

interface Message {
  sender: string;
  content: string;
}

const dummyFriends: Friend[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

const dummyMessages: Message[] = [
  { sender: "Alice", content: "Hey everyone!" },
  { sender: "Bob", content: "Hello! How's it going?" },
];

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(dummyMessages);
  const [newMessage, setNewMessage] = useState<string>("");

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { sender: "You", content: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <Card className="w-1/3 p-4 border-r shadow-md flex flex-col">
        <h2 className="text-xl font-bold mb-4">Friends</h2>
        <ScrollArea className="flex-1">
          {dummyFriends.map((friend) => (
            <div
              key={friend.id}
              className="p-2 cursor-pointer hover:bg-gray-200 rounded"
              onClick={() => setSelectedChat(friend.name)}
            >
              <User className="inline-block mr-2" /> {friend.name}
            </div>
          ))}
        </ScrollArea>
        {/* General Feed Tab */}
        <Button className="mt-4 w-full" onClick={() => setSelectedChat("General Feed")}>
          General Feed
        </Button>
      </Card>

      {/* Chat Section */}
      <div className="w-2/3 flex flex-col">
        <Card className="flex-1">
          <CardContent className="p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              {selectedChat || "Select a chat"}
            </h2>
            <div>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 p-2 rounded-md max-w-xs ${
                    msg.sender === "You" ? "bg-blue-500 text-white ml-auto" : "bg-gray-200"
                  }`}
                >
                  <strong>{msg.sender}:</strong> {msg.content}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Message Input */}
        <div className="p-4 border-t flex gap-2">
          <Input
            className="flex-1"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button onClick={sendMessage}>
            <Send size={20} />
          </Button>
          <Button>
            <Image size={20} />
          </Button>
          <Button>
            <FileText size={20} />
          </Button>
          <Button>
            <BarChart size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Image, FileText, BarChart } from "lucide-react";
import { io } from "socket.io-client";
import { faker } from "@faker-js/faker";
import { Badge } from "@/components/ui/badge";

const socket = io("http://localhost:4000");

interface Friend {
  id: number;
  name: string;
  email: string;
  available: boolean;
}

interface Message {
  sender: string;
  content: string;
}

const dummyFriends: Friend[] = [
  { id: 1, name: "Alice", email: "alice@gmail.com", available: false },
  { id: 2, name: "Bob", email: "bob@gmail.com", available: false },
  { id: 3, name: "Charlie", email: "charlie@gmail.com", available: false },
];

// const dummyMessages: Message[] = [
//   { sender: "Alice", content: "Hey everyone!" },
//   { sender: "Bob", content: "Hello! How's it going?" },
// ];

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    { content: string; sender: string }[]
  >([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [sessionUser, setsessionUser] = useState<string | null>(() => {
    return sessionStorage.getItem("sessionUser");
  });
  const [friends, setFriends] = useState<Friend[]>(dummyFriends);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  // Listen for online users from the server
  useEffect(() => {
    socket.on("onlineUsers", (users: string[]) => {
      console.log(users);
      setOnlineUsers(users.filter((user) => user !== sessionUser));
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, []);

  const addFriend = (user: string) => {
    if (!friends.some((friend) => friend.name === user)) {
      setFriends([
        ...friends,
        { id: friends.length + 1, name: user, email: "", available: true },
      ]);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      socket.emit("message", newMessage, () => {
        setMessages([...messages, { sender: "You", content: newMessage }]);
        sessionStorage.setItem("messages", JSON.stringify(messages));
        setNewMessage("");
      });
    }
  };

  useEffect(() => {
    setFriends((prevFriends) =>
      prevFriends.map((friend) =>
        friend.name === "Alice" ? { ...friend, available: true } : friend
      )
    );
  }, []);

  useEffect(() => {
    // fetch messages from session storage
    // and update the state accordingly
    const sessionMessages = JSON.parse(
      sessionStorage.getItem("messages") || "[]"
    );
    setMessages(sessionMessages);

    // listen for new messages from the server
    socket.on("incomingMessage", (message: Message) => {
      setMessages([...messages, message]);
      // save the new message to session storage
      sessionStorage.setItem(
        "messages",
        JSON.stringify([...messages, message])
      );
    });

    if (!sessionUser) {
      const randomUsername = faker.internet.username();
      sessionStorage.setItem("sessionUser", JSON.stringify(randomUsername));
      setsessionUser(randomUsername);
      socket.emit("username", randomUsername);
    } else {
      socket.emit("username", sessionUser);
    }

    // cleanup function
    return () => {
      socket.off("incomingMessage");
    };
  }, []);

  useEffect(() => {
    if (sessionUser) {
      sessionStorage.setItem("sessionUser", sessionUser);
    }
  }, [sessionUser]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <Card className="w-1/5 p-4 border-r shadow-md flex flex-col">
        <h2 className="text-xl font-bold mb-4">Friends</h2>
        <ScrollArea className="flex-1">
          <ul className="space-y-4">
            {friends.map((friend) => (
              <li
                key={friend.id}
                className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer"
                onClick={() => setSelectedChat(friend.name)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate dark:text-white">
                    {friend.name}
                  </p>
                </div>
                {friend.available ? (
                  <span className="w-2 h-2 me-1 bg-green-500 rounded-full" />
                ) : (
                  <span className="w-2 h-2 me-1 bg-red-500 rounded-full" />
                )}
              </li>
            ))}
          </ul>
        </ScrollArea>
        {/* General Feed Tab */}
        <Button
          className="mt-4 w-full"
          onClick={() => setSelectedChat("General Feed")}
        >
          General Feed
        </Button>
        <Badge color="success" variant="outline">
          Connected as {sessionUser}
        </Badge>
      </Card>

      {/* Chat Section */}
      <div className="w-3/5 flex flex-col">
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
                    msg.sender === "You"
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-gray-200"
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

      {/* Right Sidebar - Online Users */}
      <Card className="w-1/5 p-4 border-l shadow-md flex flex-col">
        <h2 className="text-xl font-bold mb-4">Online Users</h2>
        <ScrollArea className="flex-1">
          <ul className="space-y-4">
            {onlineUsers.map((user) => (
              <li key={user} className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900 truncate dark:text-white">
                  {user}
                </span>
                <Button onClick={() => addFriend(user)} size="sm">
                  Add Friend
                </Button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </Card>
    </div>
  );
}

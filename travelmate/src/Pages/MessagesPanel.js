import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import NavbarFeed from "../Components/NavBar-feed";
import echo from "../echo";
import "../CSS/Messages.css";

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("auth_token");
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?.Userid;
  const userParam = searchParams.get("user");

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const users = await res.json();
        const formatted = users.map((u) => ({
          id: u.Userid,
          name: `${u.Name} ${u.Lastname}`,
        }));
        setConversations(formatted);
        const preselect = formatted.find(
          (u) => String(u.id) === String(userParam)
        );
        setSelectedUser(preselect || formatted[0]);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, [userParam]);

  // Fetch messages between users
  useEffect(() => {
    if (!selectedUser) return;
    setMessages([]); // clear previous messages

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/messages/with/${selectedUser.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        const sorted = data.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        setMessages(sorted);
      } catch (err) {
        console.error("Message fetch failed:", err);
      }
    };

    fetchMessages();
  }, [selectedUser]);

  // Echo listener
  useEffect(() => {
    if (!selectedUser || !currentUserId) return;

    const channel = echo.private(`chat.${currentUserId}`);
    channel.listen("MessageSent", (e) => {
      const incoming = e.message;

      const isDuplicate = messages.find((msg) =>
        msg.messagesid && incoming.messagesid
          ? msg.messagesid === incoming.messagesid
          : msg.sender_id === incoming.sender_id &&
            msg.receiver_id === incoming.receiver_id &&
            msg.message === incoming.message &&
            new Date(msg.created_at).getTime() ===
              new Date(incoming.created_at).getTime()
      );

      if (
        !isDuplicate &&
        (incoming.sender_id === selectedUser.id ||
          incoming.receiver_id === selectedUser.id)
      ) {
        console.log("📩 Message received via Echo:", incoming);
        setMessages((prev) => [...prev, incoming]);
      }
    });

    return () => {
      echo.leave(`private-chat.${currentUserId}`);
    };
  }, [selectedUser, messages, currentUserId]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    try {
      const res = await fetch("http://localhost:8000/api/messages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver_id: selectedUser.id,
          message: inputMessage.trim(),
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server error:", res.status, errorText);
        return;
      }

      const newMsg = await res.json();
      setMessages((prev) => [...prev, newMsg]);
      setInputMessage("");
    } catch (err) {
      console.error("Sending failed:", err);
    }
  };

  return (
    <>
      <NavbarFeed />
      <div className="messages-layout">
        {/* Sidebar */}
        <div className="conversations-list">
          <div className="user-header">{currentUser?.Name || "You"}</div>
          <input className="search-box" placeholder="Search..." />
          <div className="conversation-items">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`conversation-item ${
                  selectedUser?.id === conv.id ? "active" : ""
                }`}
                onClick={() => setSelectedUser(conv)}
              >
                <strong>{conv.name}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          <div className="chat-header">
            <h3>{selectedUser?.name}</h3>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={`${msg.messagesid ?? `${msg.sender_id}-${msg.created_at}`}-${index}`}
                className={`message ${
                  msg.sender_id === currentUserId ? "right" : "left"
                }`}
              >
                <p>{msg.message}</p>
                {msg.sender_id === currentUserId && msg.read_at && (
                  <span className="read-receipt">✓ Read</span>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessagesPage;

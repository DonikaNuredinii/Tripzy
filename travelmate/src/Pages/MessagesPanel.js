import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../CSS/Messages.css";
import NavbarFeed from "../Components/NavBar-feed";

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchParams] = useSearchParams();

  const token = localStorage.getItem("auth_token");
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?.Userid;
  const userParam = searchParams.get("user");

  // Initialize static conversations and handle preselection via ?user=...
  useEffect(() => {
    const staticUsers = [
      { id: 2, name: "Anjesa Haxhimusa" },
      { id: 3, name: "Erza Tali" },
      { id: 4, name: "Selvete Tali-Pajaziti" },
    ];
    setConversations(staticUsers);

    const preselectUser = staticUsers.find(
      (u) => String(u.id) === String(userParam)
    );

    if (preselectUser) {
      setSelectedUser(preselectUser);
    } else {
      setSelectedUser(staticUsers[0]);
    }
  }, [userParam]);

  // Fetch messages for selected user and auto-poll
  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/messages", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        const filtered = data.filter(
          (msg) =>
            (msg.sender_id === currentUserId &&
              msg.receiver_id === selectedUser.id) ||
            (msg.sender_id === selectedUser.id &&
              msg.receiver_id === currentUserId)
        );

        setMessages(filtered);

        setTimeout(() => {
          const chatBox = document.querySelector(".chat-messages");
          if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
        }, 100);
      } catch (err) {
        console.error("Error fetching messages", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedUser]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/messages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver_id: selectedUser.id,
          message: inputMessage,
        }),
      });

      if (res.ok) {
        const newMsg = await res.json();
        setMessages((prev) => [...prev, newMsg]);
        setInputMessage("");

        setTimeout(() => {
          const chatBox = document.querySelector(".chat-messages");
          if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
        }, 100);
      }
    } catch (err) {
      console.error("Sending failed", err);
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
                <div className="last-message">Last chat...</div>
                <div className="timestamp">recent</div>
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
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${
                  msg.sender_id === currentUserId ? "right" : "left"
                }`}
              >
                {msg.message}
                {msg.sender_id === currentUserId && (
                  <span className="seen-tag">✔ Sent</span>
                )}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessagesPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/Messages.css";
import { FiMail, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const MatchRequests = () => {
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const fetchMatchRequests = async () => {
    const token = localStorage.getItem("auth_token");
    try {
      const res = await axios.get(
        "http://localhost:8000/api/my-match-requests",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Logged in user ID:", localStorage.getItem("user_id"));
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch match requests", err);
    }
  };

  const fetchNotifications = async () => {
    const token = localStorage.getItem("auth_token");
    try {
      const res = await axios.get("http://localhost:8000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Notifications fetched:", res.data);

      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const handleResponse = async (id, status) => {
    const token = localStorage.getItem("auth_token");
    try {
      await axios.put(
        `http://localhost:8000/api/trip-matches/${id}`,
        { status }, // Ensure capital 'S'
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchMatchRequests();
      fetchNotifications(); // Refresh notifications
    } catch (err) {
      console.error("Failed to update match status", err);
    }
  };

  useEffect(() => {
    fetchMatchRequests();
    fetchNotifications();
  }, []);

  return (
    <div className="match-requests-wrapper">
      <h2>Match Requests</h2>

      {/* Match Requests FIRST */}
      {requests.length === 0 ? (
        <p>No match activity yet.</p>
      ) : (
        <ul className="match-list">
          {requests
            .filter((req) => req.Status !== "rejected")
            .map((req) => {
              const { trip_matchesid, Status, sender, trip, created_at } = req;

              const profileImage =
                sender?.profile_picture || "/Images/profile-placeholder.jpg";
              const tripCity = trip?.Destination_city || "your destination";

              return (
                <li key={trip_matchesid} className={`match-request ${Status}`}>
                  <img
                    src={profileImage}
                    alt={sender?.Name}
                    className="match-avatar"
                  />

                  <div className="match-info">
                    <strong>{sender?.Name || "Someone"}</strong> requested to
                    match your trip to <strong>{tripCity}</strong>
                    <p className="match-time">
                      {new Date(created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="match-actions">
                    {Status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleResponse(trip_matchesid, "accepted")
                          }
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            handleResponse(trip_matchesid, "rejected")
                          }
                          className="deny"
                        >
                          Deny
                        </button>
                      </>
                    )}

                    {Status === "accepted" && (
                      <button
                        title="Go to messages"
                        className="icon-btn accepted"
                        onClick={() =>
                          navigate(`/messages?user=${sender?.Userid}`)
                        }
                      >
                        <FiMail size={30} />
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
        </ul>
      )}

      {/* Notifications SECOND */}
      {notifications.length > 0 && (
        <>
          <h2>Notifications</h2>
          <ul className="match-list">
            {notifications.map((note) => (
              <li
                key={note.id}
                className={`match-request ${
                  note.type === "match_accepted" ? "accepted" : "rejected"
                }`}
              >
                <div className="match-info">
                  <strong>{note.message}</strong>
                  <p className="match-time">
                    {new Date(note.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="match-actions">
                  {note.type === "match_accepted" ? (
                    <FiCheckCircle size={24} className="icon-btn accepted" />
                  ) : (
                    <FiXCircle size={24} className="icon-btn denied" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default MatchRequests;

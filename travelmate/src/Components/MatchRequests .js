import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/Messages.css";
import { FiMail } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const MatchRequests = () => {
  const [requests, setRequests] = useState([]);
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
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch match requests", err);
    }
  };

  const handleResponse = async (id, status) => {
    const token = localStorage.getItem("auth_token");
    try {
      await axios.put(
        `http://localhost:8000/api/trip-matches/${id}`,
        { Status: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMatchRequests();
    } catch (err) {
      console.error("Failed to update match status", err);
    }
  };

  useEffect(() => {
    fetchMatchRequests();
  }, []);

  return (
    <div className="match-requests-wrapper">
      <h2>Match Notifications</h2>

      {requests.length === 0 ? (
        <p>No match activity yet.</p>
      ) : (
        <ul className="match-list">
          {requests.map((req) => {
            const { trip_matchesid, Status, user, trip, created_at } = req;

            const profileImage =
              user?.profile_picture || "/Images/profile-placeholder.jpg";
            const tripCity = trip?.Destination_city || "your destination";

            return (
              <li key={trip_matchesid} className={`match-request ${Status}`}>
                <img
                  src={profileImage}
                  alt={user?.Name}
                  className="match-avatar"
                />

                <div className="match-info">
                  <strong>{user?.Name}</strong> requested to match your trip to{" "}
                  <strong>{tripCity}</strong>
                  <p className="match-time">
                    {new Date(created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="match-actions">
                  {Status === "pending" ? (
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
                  ) : Status === "accepted" ? (
                    <button
                      title="Go to messages"
                      className="icon-btn accepted"
                      onClick={() => navigate(`/messages?user=${user?.Userid}`)}
                    >
                      <FiMail size={20} />
                    </button>
                  ) : (
                    <span className="denied-label">Denied ❌</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MatchRequests;

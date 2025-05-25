import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/Style.css";
import CreateTripPost from "../Components/CreateTripPost";

const TripFeed = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [error, setError] = useState("");

  const fetchTrips = async () => {
    try {
      const token = localStorage.getItem("auth_token");

      const res = await axios.get("http://localhost:8000/api/trips", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Trips fetched:", res.data); // 🔍 Inspect this
      setTrips(res.data);
    } catch (err) {
      console.error("Failed to fetch trips:", err);
      setError("Failed to load trips.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <div className="trip-feed">
      <div className="trip-feed-header">
        <button
          className="add-trip-btn"
          onClick={() => setShowPostForm(!showPostForm)}
        >
          {showPostForm ? "✖ Cancel" : "➕ Add Trip"}
        </button>
      </div>

      {showPostForm && (
        <div className="trip-form-container">
          <CreateTripPost onPostSuccess={fetchTrips} />
        </div>
      )}

      {loading ? (
        <p>Loading trips...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : trips.length === 0 ? (
        <p>No trips posted yet.</p>
      ) : (
        trips.map((trip) => (
          <div key={trip.Tripid} className="wide-trip-card">
            <div className="trip-content">
              <div className="trip-text">
                <h3>{trip.user?.Name || "Anonymous"}</h3>
                <p className="trip-destination">
                  {trip.Destination_city}, {trip.Destination_country}
                </p>
                <p className="trip-description">{trip.Description}</p>
                <div className="trip-info">
                  <p>
                    📅 <strong>Dates:</strong> {trip.Departuredate} →{" "}
                    {trip.Return_date}
                  </p>
                  <p>
                    🧭 <strong>Style:</strong> {trip.Travel_STYLE}
                  </p>
                  <p>
                    🧍 <strong>Looking For:</strong> {trip.Looking_for}
                  </p>
                  <p>
                    💰 <strong>Budget:</strong> {trip.Budget_estimated} €
                  </p>
                </div>
                <p className="meta">
                  Posted on {new Date(trip.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="trip-image">
                <img
                  src={
                    trip.photos?.[0]
                      ? `http://localhost:8000/storage/${trip.photos[0].image_path}`
                      : "/Images/default.jpg"
                  }
                  alt="Trip"
                />
              </div>
            </div>

            <div className="trip-reactions">
              <div className="likes-comments">
                <span>👍 Laida Rusinovci and 16 others</span>
                <span>2 comments</span>
              </div>
              <div className="action-buttons">
                <button>👍 Like</button>
                <button>💬 Comment</button>
                <button>💞 Match</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TripFeed;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/Style.css";
import CreateTripPost from "../Components/CreateTripPost";
import TripComments from "../Components/TripComments";
import MatchRequests from "../Components/MatchRequests ";

const TripFeed = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [activeCommentTripId, setActiveCommentTripId] = useState(null);
  const [error, setError] = useState("");

  const fetchTrips = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await axios.get("http://localhost:8000/api/trips", {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  const handleLike = async (tripId, alreadyLiked) => {
    const token = localStorage.getItem("auth_token");
    const userName = localStorage.getItem("user_name");

    if (!userName) {
      console.warn("No user_name found in localStorage!");
      return;
    }

    try {
      const url = `http://localhost:8000/api/trips/${tripId}/likes`;

      if (alreadyLiked) {
        await axios.delete(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(
          url,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setTrips((prevTrips) =>
        prevTrips.map((trip) => {
          if (trip.Tripid !== tripId) return trip;

          let updatedLikes = [...(trip.likes || [])];

          if (alreadyLiked) {
            updatedLikes = updatedLikes.filter(
              (like) => like.user?.Name !== userName
            );
          } else {
            updatedLikes.push({ user: { Name: userName } });
          }

          return {
            ...trip,
            liked_by_user: !alreadyLiked,
            likes_count: (trip.likes_count || 0) + (alreadyLiked ? -1 : 1),
            likes: updatedLikes,
          };
        })
      );
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const currentUserName = localStorage.getItem("user_name");
  /*Add HandleMatch*/
  const handleMatch = async (tripId) => {
    const token = localStorage.getItem("auth_token");
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      alert("User ID missing from localStorage.");
      return;
    }

    try {
      const data = {
        Tripid: tripId,
        Userid: userId,
        Status: "pending",
      };

      await axios.post("http://localhost:8000/api/trip-matches", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Match request sent!");
    } catch (err) {
      console.error("Error sending match request:", err);
      alert("Failed to match. You may have already matched.");
    }
  };

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
        trips.map((trip) => {
          const names =
            trip.likes?.map((like) => like.user?.Name).filter(Boolean) || [];

          if (trip.liked_by_user && currentUserName) {
            const index = names.indexOf(currentUserName);
            if (index !== -1) names[index] = "You";
          }

          let likesText = "No likes yet";
          if (names.length === 1) likesText = `Liked by ${names[0]}`;
          else if (names.length === 2)
            likesText = `Liked by ${names[0]} and ${names[1]}`;
          else if (names.length > 2)
            likesText = `Liked by ${names[0]}, ${names[1]} and ${names.length - 2} others`;

          const commentCount =
            trip.liveCommentCount ?? trip.comments_count ?? 0;
          const commentText = `${commentCount} comment${commentCount === 1 ? "" : "s"}`;

          return (
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
                  <span>👍 {likesText}</span>
                  <span>{commentText}</span>
                </div>

                <div className="action-buttons">
                  <button
                    className={trip.liked_by_user ? "liked" : ""}
                    onClick={() => handleLike(trip.Tripid, trip.liked_by_user)}
                  >
                    👍 Like{" "}
                    {Number.isInteger(trip.likes_count) && trip.likes_count >= 0
                      ? `(${trip.likes_count})`
                      : ""}
                  </button>

                  <button
                    onClick={() =>
                      setActiveCommentTripId((id) =>
                        id === trip.Tripid ? null : trip.Tripid
                      )
                    }
                  >
                    💬{" "}
                    {activeCommentTripId === trip.Tripid ? "Hide" : "Comment"}
                  </button>

                  <button onClick={() => handleMatch(trip.Tripid)}>
                    💞 Match
                  </button>
                </div>
              </div>

              {activeCommentTripId === trip.Tripid && (
                <TripComments
                  tripId={trip.Tripid}
                  onNewComment={(count) =>
                    setTrips((prevTrips) =>
                      prevTrips.map((t) =>
                        t.Tripid === trip.Tripid
                          ? { ...t, liveCommentCount: count }
                          : t
                      )
                    )
                  }
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default TripFeed;

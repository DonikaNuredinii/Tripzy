import React, { useState } from "react";
import "../CSS/Style.css";
import CreateTripPost from "../Components/CreateTripPost";

const sampleImage = "/Images/Hawaii.jpg";

const demoTrips = [
  {
    id: 1,
    user: {
      Name: "Rrona Pajaziti",
      Profile_photo: "/images/users/rrona.jpg",
    },
    Description:
      "Sunset at the Eiffel Tower 🌇✨ Had an amazing time with new friends!",
    Destination_country: "France",
    Destination_city: "Paris",
    Departuredate: "2025-04-20",
    Return_date: "2025-04-25",
    Travel_STYLE: "Romantic",
    Budget_estimated: 600,
    Looking_for: "Travel buddies",
    photos: [sampleImage],
    created_at: "2025-04-26T15:20:00",
  },
];

const TripFeed = () => {
  const [showPostForm, setShowPostForm] = useState(false);

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
          <CreateTripPost />
        </div>
      )}

      {demoTrips.map((trip) => (
        <div key={trip.id} className="wide-trip-card">
          <div className="trip-content">
            <div className="trip-text">
              <h3>{trip.user.Name}</h3>
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
              <img src={trip.photos[0]} alt="Trip" />
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
      ))}
    </div>
  );
};

export default TripFeed;
